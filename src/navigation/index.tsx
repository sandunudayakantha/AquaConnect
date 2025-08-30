import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import UserDashboard from '../screens/UserDashboard';
import OrganizationDashboard from '../screens/OrganizationDashboard';

const Stack = createStackNavigator();

export const Navigation = () => {
  const { state, dispatch } = useAppContext();

  if (state.showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          dispatch({ type: 'SET_SPLASH', payload: false });
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!state.isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // App screens based on user role
          <>
            {state.user?.role === 'organization' ? (
              <Stack.Screen name="OrganizationDashboard" component={OrganizationDashboard} />
            ) : (
              <Stack.Screen name="UserDashboard" component={UserDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
