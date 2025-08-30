# 🔥 Firebase Setup Guide for AquaConnect

## ❌ Current Issue
You're getting the error `auth/configuration-not-found` because Firebase is not properly configured.

## ✅ Solution Steps

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter project name: `AquaConnect` (or your preferred name)
4. Follow the setup wizard

### Step 2: Enable Authentication
1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Step 3: Enable Firestore Database
1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Get Firebase Configuration
1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Add app" and select the web icon (</>)
5. Register your app with nickname: `AquaConnect`
6. Copy the configuration object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 5: Create Environment File
1. Create a file named `.env` in your project root
2. Add your Firebase configuration:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Step 6: Restart Development Server
1. Stop your current development server (Ctrl+C)
2. Run `npm start` again
3. The app should now work without Firebase errors

## 🔧 Troubleshooting

### If you still get configuration errors:
1. Make sure the `.env` file is in the project root (same level as `package.json`)
2. Make sure there are no spaces around the `=` in the `.env` file
3. Make sure you copied the exact values from Firebase Console
4. Restart the development server after creating the `.env` file

### If you get permission errors:
1. Go to Firestore Database in Firebase Console
2. Click "Rules" tab
3. Update the rules to allow read/write for authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎯 What This Enables

Once Firebase is properly configured, you'll have:
- ✅ User authentication (signup/login)
- ✅ User data storage in Firestore
- ✅ Role-based user management
- ✅ Offline data persistence
- ✅ Secure data access

## 📱 Test the Setup

1. Start the app
2. Go through the splash screens
3. Try to create a new account
4. Try to login with the created account
5. Verify you can access the appropriate dashboard based on your role

The authentication should now work without any configuration errors!
