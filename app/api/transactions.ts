import { Transaction } from '../types';
import { request } from './client';

export function getTransactions(): Promise<Transaction[]> {
  return request<Transaction[]>('/transactions');
}

export function getTransaction(id: string): Promise<Transaction> {
  return request<Transaction>(`/transactions/${id}`);
}

export function createTransaction(
  accountId: string,
  amount: number,
): Promise<Transaction> {
  return request<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify({ account_id: accountId, amount }),
  });
}
