import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { Navigation } from './src/navigation';
import { theme } from './src/styles/theme';

const AppContent = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Only hide splash screen if user is authenticated
    // Otherwise, let user interact with splash screens
    if (state.isAuthenticated && state.showSplash) {
      dispatch({ type: 'SET_SPLASH', payload: false });
    }
  }, [state.isAuthenticated, state.showSplash, dispatch]);

  // Show loading indicator while checking auth state
  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Navigation />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
