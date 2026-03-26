import { Account } from '../types';
import { request } from './client';

export function getAccount(id: string): Promise<Account> {
  return request<Account>(`/accounts/${id}`);
}
