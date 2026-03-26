import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/Colors';
import { useAppState } from '../context/AppContext';
import { getTransactions } from '../api/transactions';
import TransactionList from '../components/TransactionList';
import ErrorBanner from '../components/ErrorBanner';

export default function HistoryScreen() {
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
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, [fetchTransactions]);

  const headerComponent = (
    <View style={styles.header}>
      <Text variant="titleMedium" style={styles.heading}>
        Transaction History
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        {state.transactions.length} transaction
        {state.transactions.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TransactionList
        transactions={state.transactions}
        deviceTransactionIds={state.deviceTransactionIds}
        accountBalances={state.accountBalances}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        header={headerComponent}
      />
      <ErrorBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  heading: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
  },
});
