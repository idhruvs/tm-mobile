import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Menu,
  TouchableRipple,
  Text,
} from 'react-native-paper';
import { palette } from '../constants/Colors';
import { useAppState } from '../context/AppContext';
import { createTransaction } from '../api/transactions';
import { getAccount } from '../api/accounts';
import { ApiError } from '../api/client';

interface FormErrors {
  amount?: string;
  account?: string;
}

function validate(amount: string, accountId: string): FormErrors {
  const errors: FormErrors = {};

  const trimmed = amount.trim();
  if (!trimmed) {
    errors.amount = 'Amount is required';
  } else if (isNaN(Number(trimmed))) {
    errors.amount = 'Amount must be a valid number';
  } else if (Number(trimmed) === 0) {
    errors.amount = 'Amount cannot be zero';
  }

  if (!accountId) {
    errors.account = 'Please select an account';
  }

  return errors;
}

export default function TransactionForm() {
  const { state, dispatch } = useAppState();
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedId = state.selectedAccountId;
  const selectedAccount = state.accounts.find((a) => a.id === selectedId);
  const displayName = selectedAccount?.alias ?? 'Select account';

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    const formErrors = validate(amount, selectedId);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const tx = await createTransaction(selectedId, Number(amount.trim()));
      dispatch({ type: 'ADD_TRANSACTION', payload: tx });
      dispatch({ type: 'TRACK_DEVICE_TRANSACTION', payload: tx.transaction_id });

      // fetch updated balance
      try {
        const account = await getAccount(selectedId);
        dispatch({
          type: 'SET_ACCOUNT_BALANCE',
          payload: { transactionId: tx.transaction_id, balance: account.balance },
        });
      } catch {
        // balance fetch is best-effort, don't block on it
      }

      setAmount('');
      setErrors({});
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      setSubmitting(false);
    }
  }, [amount, selectedId, dispatch]);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.heading}>
        New Transaction
      </Text>

      {/* Account selector */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setMenuVisible(true)}>
            <TextInput
              label="Account"
              value={displayName}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              pointerEvents="none"
              style={styles.input}
              outlineColor={palette.border}
              activeOutlineColor={palette.primary}
            />
          </TouchableRipple>
        }
      >
        {state.accounts.map((acct) => (
          <Menu.Item
            key={acct.id}
            title={acct.alias}
            onPress={() => {
              dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: acct.id });
              setMenuVisible(false);
            }}
            leadingIcon={acct.id === selectedId ? 'check' : undefined}
          />
        ))}
      </Menu>
      <HelperText type="error" visible={!!errors.account}>
        {errors.account}
      </HelperText>

      {/* Amount input */}
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
        }}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        outlineColor={palette.border}
        activeOutlineColor={palette.primary}
        error={!!errors.amount}
        testID="amount-input"
      />
      <HelperText type="error" visible={!!errors.amount} testID="amount-error">
        {errors.amount}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
        style={styles.button}
        buttonColor={palette.primary}
        testID="submit-button"
      >
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  heading: {
    marginBottom: 14,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: palette.surface,
  },
  button: {
    marginTop: 6,
    borderRadius: 8,
    paddingVertical: 2,
  },
});
