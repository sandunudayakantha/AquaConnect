import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { UserData } from '../services/authService';
import authService from '../services/authService';

// Define the app state interface
interface AppState {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  showSplash: boolean;
}

// Define action types
type AppAction =
  | { type: 'SET_USER'; payload: UserData | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_SPLASH'; payload: boolean }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AppState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  showSplash: true,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_SPLASH':
      return { ...state, showSplash: action.payload };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      };
    default:
      return state;
  }
};

// Create context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'user' | 'organization') => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.signIn(email, password);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role: 'user' | 'organization') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.signUp(email, password, name, role);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    signup,
    logout,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
