import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { palette } from '../constants/Colors';
import { Transaction } from '../types';
import TransactionItem from './TransactionItem';

const PAGE_SIZE = 10;

interface Props {
  transactions: Transaction[];
  deviceTransactionIds: string[];
  accountBalances: Record<string, number>;
  refreshing: boolean;
  onRefresh: () => void;
  header?: React.ReactElement;
}

export default function TransactionList({
  transactions,
  deviceTransactionIds,
  accountBalances,
  refreshing,
  onRefresh,
  header,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleData = useMemo(
    () => transactions.slice(0, visibleCount),
    [transactions, visibleCount],
  );

  const hasMore = visibleCount < transactions.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Reset visible count when transactions change (e.g. refresh)
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [transactions.length]);

  return (
    <FlatList
      data={visibleData}
      keyExtractor={(item) => item.transaction_id}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No transactions yet
          </Text>
          <Text variant="bodySmall" style={styles.emptySubtext}>
            Submit a transaction to get started
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const isDeviceTx = deviceTransactionIds.includes(item.transaction_id);
        return (
          <TransactionItem
            transaction={item}
            showBalance={isDeviceTx}
            balance={accountBalances[item.transaction_id]}
          />
        );
      }}
      ListFooterComponent={
        hasMore ? (
          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={handleShowMore}
              textColor={palette.primary}
              compact
            >
              Show more ({transactions.length - visibleCount} remaining)
            </Button>
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={palette.primary}
        />
      }
      contentContainerStyle={[
        styles.content,
        transactions.length === 0 && styles.emptyContainer,
      ]}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingBottom: 16,
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: palette.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    color: palette.placeholder,
    marginTop: 4,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
