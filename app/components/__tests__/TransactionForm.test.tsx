import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import TransactionForm from '../TransactionForm';
import { AppProvider } from '../../context/AppContext';
import * as transactionsApi from '../../api/transactions';
import * as accountsApi from '../../api/accounts';

// Wrap component with required providers
function renderWithProviders() {
  return render(
    <PaperProvider>
      <AppProvider>
        <TransactionForm />
      </AppProvider>
    </PaperProvider>,
  );
}

jest.mock('../../api/transactions');
jest.mock('../../api/accounts');

const mockCreateTransaction = transactionsApi.createTransaction as jest.Mock;
const mockGetAccount = accountsApi.getAccount as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TransactionForm', () => {
  it('renders the form fields and submit button', () => {
    const { getByTestId, getByText } = renderWithProviders();

    expect(getByTestId('amount-input')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
    expect(getByText('New Transaction')).toBeTruthy();
  });

  it('shows validation error when amount is empty', async () => {
    const { getByTestId } = renderWithProviders();

    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByTestId('amount-error')).toBeTruthy();
    });

    expect(mockCreateTransaction).not.toHaveBeenCalled();
  });

  it('shows validation error for non-numeric amount', async () => {
    const { getByTestId } = renderWithProviders();

    fireEvent.changeText(getByTestId('amount-input'), 'abc');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      const errorEl = getByTestId('amount-error');
      expect(errorEl.props.children).toContain('valid number');
    });

    expect(mockCreateTransaction).not.toHaveBeenCalled();
  });

  it('shows validation error when amount is zero', async () => {
    const { getByTestId } = renderWithProviders();

    fireEvent.changeText(getByTestId('amount-input'), '0');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      const errorEl = getByTestId('amount-error');
      expect(errorEl.props.children).toContain('cannot be zero');
    });

    expect(mockCreateTransaction).not.toHaveBeenCalled();
  });

  it('submits successfully with a valid amount', async () => {
    mockCreateTransaction.mockResolvedValue({
      transaction_id: 'tx-1',
      account_id: '0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2',
      amount: 42,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockGetAccount.mockResolvedValue({
      account_id: '0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2',
      balance: 142,
    });

    const { getByTestId } = renderWithProviders();

    fireEvent.changeText(getByTestId('amount-input'), '42');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockCreateTransaction).toHaveBeenCalledWith(
        '0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2',
        42,
      );
    });
  });

  it('clears the amount field after successful submission', async () => {
    mockCreateTransaction.mockResolvedValue({
      transaction_id: 'tx-2',
      account_id: '0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2',
      amount: 10,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockGetAccount.mockResolvedValue({
      account_id: '0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2',
      balance: 110,
    });

    const { getByTestId } = renderWithProviders();

    fireEvent.changeText(getByTestId('amount-input'), '10');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByTestId('amount-input').props.value).toBe('');
    });
  });

  it('clears inline error when user starts typing', async () => {
    const { getByTestId } = renderWithProviders();

    // Trigger validation error
    fireEvent.press(getByTestId('submit-button'));
    await waitFor(() => {
      expect(getByTestId('amount-error')).toBeTruthy();
    });

    // Start typing — error should clear
    fireEvent.changeText(getByTestId('amount-input'), '5');

    await waitFor(() => {
      // HelperText still renders but should have no error text
      const errorEl = getByTestId('amount-error');
      expect(errorEl.props.children).toBeUndefined();
    });
  });
});
