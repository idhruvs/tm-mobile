import React from 'react';
import { Snackbar } from 'react-native-paper';
import { palette } from '../constants/Colors';
import { useAppState } from '../context/AppContext';

export default function ErrorBanner() {
  const { state, dispatch } = useAppState();

  return (
    <Snackbar
      visible={!!state.error}
      onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
      duration={4000}
      style={{ backgroundColor: palette.error }}
      action={{
        label: 'Dismiss',
        textColor: '#fff',
        onPress: () => dispatch({ type: 'SET_ERROR', payload: null }),
      }}
    >
      {state.error ?? ''}
    </Snackbar>
  );
}
