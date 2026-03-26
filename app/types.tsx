export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

// Domain types

export interface Transaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  created_at: string;
}

export interface Account {
  account_id: string;
  balance: number;
}

export interface ManagedAccount {
  id: string;
  alias: string;
}

// App state

export interface AppState {
  transactions: Transaction[];
  accounts: ManagedAccount[];
  selectedAccountId: string;
  accountBalances: Record<string, number>;
  deviceTransactionIds: string[];
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'TRACK_DEVICE_TRANSACTION'; payload: string }
  | { type: 'SET_ACCOUNT_BALANCE'; payload: { transactionId: string; balance: number } }
  | { type: 'ADD_ACCOUNT'; payload: ManagedAccount }
  | { type: 'REMOVE_ACCOUNT'; payload: string }
  | { type: 'SET_SELECTED_ACCOUNT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'HYDRATE'; payload: Partial<AppState> };
