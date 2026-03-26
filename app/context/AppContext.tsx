import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_ACCOUNT_ID } from '../constants/Config';
import { AppState, AppAction, ManagedAccount } from '../types';

const STORAGE_KEY_DEVICE_TXS = '@tm/deviceTransactionIds';
const STORAGE_KEY_BALANCES = '@tm/accountBalances';
const STORAGE_KEY_ACCOUNTS = '@tm/accounts';

const defaultAccount: ManagedAccount = {
  id: DEFAULT_ACCOUNT_ID,
  alias: 'Account #1',
};

const initialState: AppState = {
  transactions: [],
  accounts: [defaultAccount],
  selectedAccountId: DEFAULT_ACCOUNT_ID,
  accountBalances: {},
  deviceTransactionIds: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case 'TRACK_DEVICE_TRANSACTION':
      return {
        ...state,
        deviceTransactionIds: [...state.deviceTransactionIds, action.payload],
      };

    case 'SET_ACCOUNT_BALANCE':
      return {
        ...state,
        accountBalances: {
          ...state.accountBalances,
          [action.payload.transactionId]: action.payload.balance,
        },
      };

    case 'ADD_ACCOUNT':
      if (state.accounts.some((a) => a.id === action.payload.id)) return state;
      return { ...state, accounts: [...state.accounts, action.payload] };

    case 'REMOVE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter((a) => a.id !== action.payload),
        selectedAccountId:
          state.selectedAccountId === action.payload
            ? state.accounts[0]?.id ?? ''
            : state.selectedAccountId,
      };

    case 'SET_SELECTED_ACCOUNT':
      return { ...state, selectedAccountId: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'HYDRATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Rehydrate persisted data on mount
  useEffect(() => {
    async function hydrate() {
      try {
        const [txIds, balances, accounts] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_DEVICE_TXS),
          AsyncStorage.getItem(STORAGE_KEY_BALANCES),
          AsyncStorage.getItem(STORAGE_KEY_ACCOUNTS),
        ]);

        const hydrated: Partial<AppState> = {};

        if (txIds) hydrated.deviceTransactionIds = JSON.parse(txIds);
        if (balances) hydrated.accountBalances = JSON.parse(balances);
        if (accounts) {
          const parsed: ManagedAccount[] = JSON.parse(accounts);
          // ensure default account is always present
          if (!parsed.some((a) => a.id === DEFAULT_ACCOUNT_ID)) {
            parsed.unshift(defaultAccount);
          }
          hydrated.accounts = parsed;
        }

        if (Object.keys(hydrated).length > 0) {
          dispatch({ type: 'HYDRATE', payload: hydrated });
        }
      } catch {
        // storage read failed — proceed with defaults
      }
    }

    hydrate();
  }, []);

  // Persist deviceTransactionIds whenever they change
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY_DEVICE_TXS,
      JSON.stringify(state.deviceTransactionIds),
    ).catch(() => {});
  }, [state.deviceTransactionIds]);

  // Persist accountBalances whenever they change
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY_BALANCES,
      JSON.stringify(state.accountBalances),
    ).catch(() => {});
  }, [state.accountBalances]);

  // Persist managed accounts whenever they change
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY_ACCOUNTS,
      JSON.stringify(state.accounts),
    ).catch(() => {});
  }, [state.accounts]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return ctx;
}

/** Resolve an account_id to its alias, or fall back to a truncated ID */
export function useAccountAlias(accountId: string): string {
  const { state } = useAppState();
  const match = state.accounts.find((a) => a.id === accountId);
  return match ? match.alias : `${accountId.slice(0, 8)}...`;
}
