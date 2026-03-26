import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/Colors';
import { Transaction } from '../types';
import { useAccountAlias } from '../context/AppContext';

interface Props {
  transaction: Transaction;
  showBalance: boolean;
  balance?: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TransactionItem({ transaction, showBalance, balance }: Props) {
  const isCredit = transaction.amount > 0;
  const alias = useAccountAlias(transaction.account_id);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text variant="bodyLarge" style={styles.amount}>
            {isCredit ? '+' : ''}
            {transaction.amount.toFixed(2)}
          </Text>
          <Text variant="bodySmall" style={styles.meta}>
            {alias}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(transaction.created_at)}
          </Text>
        </View>

        {showBalance && balance !== undefined && (
          <View style={styles.balanceBadge}>
            <Text variant="labelSmall" style={styles.balanceLabel}>
              Balance
            </Text>
            <Text variant="bodyMedium" style={styles.balanceValue}>
              {balance.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default memo(TransactionItem);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  amount: {
    fontWeight: '700',
    fontSize: 17,
    color: palette.textPrimary,
  },
  meta: {
    color: palette.textSecondary,
    marginTop: 3,
  },
  date: {
    color: palette.placeholder,
    marginTop: 2,
  },
  balanceBadge: {
    alignItems: 'flex-end',
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  balanceLabel: {
    color: palette.primaryDark,
    fontSize: 10,
  },
  balanceValue: {
    color: palette.primaryDark,
    fontWeight: '700',
  },
});
