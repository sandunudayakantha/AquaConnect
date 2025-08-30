import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyApGjXtkDxs3huwH5wOGvZTJROgeuFajiI',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'aquaconnect-e6b86.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'aquaconnect-e6b86',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'aquaconnect-e6b86.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '269163632736',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:269163632736:web:30523c5fe4dab53ee98b05',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-2SCFK3HK27',
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  console.log('🔍 Checking Firebase configuration...');
  console.log('Current config:', firebaseConfig);
  
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error('❌ Firebase configuration is missing required fields:', missingFields);
    console.error('📝 Please create a .env file with your Firebase configuration.');
    console.error('📋 See firebase.config.example for reference.');
    console.error('🔧 Quick fix: Create a .env file in your project root with your Firebase config');
    return false;
  }
  
  // Check if using placeholder values
  const placeholderValues = ['your-api-key', 'your-auth-domain', 'your-project-id', 'your-storage-bucket', 'your-messaging-sender-id', 'your-app-id'];
  const hasPlaceholders = Object.values(firebaseConfig).some(value => placeholderValues.includes(value || ''));
  
  if (hasPlaceholders) {
    console.error('❌ Firebase configuration contains placeholder values.');
    console.error('📝 Please replace with your actual Firebase configuration.');
    console.error('📋 See firebase.config.example for reference.');
    return false;
  }
  
  console.log('✅ Firebase configuration looks good!');
  return true;
};

// Check configuration but don't throw error immediately
const isConfigValid = validateFirebaseConfig();

// Initialize Firebase only if config is valid
let app, auth, db, storage;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    throw error;
  }
} else {
  console.error('❌ Firebase not initialized due to invalid configuration');
  // Create dummy exports to prevent app crashes
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };
export default app;
