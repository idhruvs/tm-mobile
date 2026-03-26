import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/Colors';
import { useAppState } from '../context/AppContext';
import { getTransactions } from '../api/transactions';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ErrorBanner from '../components/ErrorBanner';

export default function TransactionsScreen() {
  const { state, dispatch } = useAppState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      dispatch({ type: 'SET_TRANSACTIONS', payload: data });
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load transactions.',
      });
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    fetchTransactions().finally(() =>
      dispatch({ type: 'SET_LOADING', payload: false }),
    );
  }, [fetchTransactions, dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, [fetchTransactions]);

  const headerComponent = (
    <>
      <TransactionForm />
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Transactions
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          {state.transactions.length} total
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TransactionList
        transactions={state.transactions}
        deviceTransactionIds={state.deviceTransactionIds}
        accountBalances={state.accountBalances}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        header={headerComponent}
      />
      <ErrorBanner />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: palette.textSecondary,
  },
});
