import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebase';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'organization';
  createdAt: Date;
}

class AuthService {
  private readonly USER_STORAGE_KEY = '@aquaconnect_user';

  // Sign up new user
  async signUp(email: string, password: string, name: string, role: 'user' | 'organization'): Promise<UserData> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userData: Omit<UserData, 'uid'> = {
        email: user.email!,
        name,
        role,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      const fullUserData: UserData = {
        uid: user.uid,
        ...userData,
      };

      // Save to AsyncStorage for offline access
      await this.saveUserToStorage(fullUserData);

      return fullUserData;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string): Promise<UserData> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          throw new Error('User data not found');
        }

        const userData = userDoc.data();
        const fullUserData: UserData = {
          uid: user.uid,
          email: user.email!,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt.toDate(),
        };

        // Save to AsyncStorage for offline access
        await this.saveUserToStorage(fullUserData);

        return fullUserData;
      } catch (firestoreError: any) {
        console.warn('Firestore access error during sign in:', firestoreError);
        
        // If it's a permissions error, create basic user data
        if (firestoreError.code === 'permission-denied' || firestoreError.message?.includes('permissions')) {
          console.log('Firestore permissions issue - creating basic user data');
          const basicUserData: UserData = {
            uid: user.uid,
            email: user.email!,
            name: user.displayName || 'User',
            role: 'user',
            createdAt: new Date(),
          };
          
          // Save to AsyncStorage for offline access
          await this.saveUserToStorage(basicUserData);
          
          return basicUserData;
        }
        
        throw firestoreError;
      }
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(this.USER_STORAGE_KEY);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<UserData | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }

      // Try to get from AsyncStorage first (offline)
      const storedUser = await this.getUserFromStorage();
      if (storedUser && storedUser.uid === user.uid) {
        return storedUser;
      }

      // Get from Firestore (online)
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          console.warn('User document not found in Firestore');
          return null;
        }

        const userData = userDoc.data();
        const fullUserData: UserData = {
          uid: user.uid,
          email: user.email!,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt.toDate(),
        };

        // Update AsyncStorage
        await this.saveUserToStorage(fullUserData);

        return fullUserData;
      } catch (firestoreError: any) {
        console.warn('Firestore access error:', firestoreError);
        
        // If it's a permissions error, return basic user info
        if (firestoreError.code === 'permission-denied' || firestoreError.message?.includes('permissions')) {
          console.log('Firestore permissions issue - returning basic user info');
          const basicUserData: UserData = {
            uid: user.uid,
            email: user.email!,
            name: user.displayName || 'User',
            role: 'user',
            createdAt: new Date(),
          };
          return basicUserData;
        }
        
        throw firestoreError;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: UserData | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await this.getCurrentUser();
          callback(userData);
        } catch (error) {
          console.error('Error getting user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Save user to AsyncStorage
  private async saveUserToStorage(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Get user from AsyncStorage
  private async getUserFromStorage(): Promise<UserData | null> {
    try {
      const userString = await AsyncStorage.getItem(this.USER_STORAGE_KEY);
      if (userString) {
        const userData = JSON.parse(userString);
        // Convert createdAt back to Date object
        userData.createdAt = new Date(userData.createdAt);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }

  // Handle Firebase auth errors
  private handleAuthError(error: any): Error {
    let message = 'An error occurred during authentication';

    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters long';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection';
          break;
        default:
          message = error.message || message;
      }
    }

    return new Error(message);
  }
}

export const authService = new AuthService();
export default authService;
