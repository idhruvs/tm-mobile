import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

import { AppProvider } from './context/AppContext';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    primaryContainer: '#BBDEFB',
    error: '#D32F2F',
    background: '#FAFAFA',
    surface: '#FFFFFF',
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppProvider>
          <Navigation />
          <StatusBar style="dark" />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
