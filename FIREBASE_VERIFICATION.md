# 🔥 Firebase Project Verification Guide

## ✅ Your Firebase Configuration
Your Firebase configuration looks correct:
- **Project ID**: `aquaconnect-e6b86`
- **API Key**: `AIzaSyApGjXtkDxs3huwH5wOGvZTJROgeuFajiI`
- **Auth Domain**: `aquaconnect-e6b86.firebaseapp.com`

## 🔍 Required Firebase Services

### 1. Authentication
**Status**: ❓ Need to verify
**Required**: Email/Password authentication enabled

**To check/enable:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `aquaconnect-e6b86`
3. Click "Authentication" in the left sidebar
4. Click "Get started" if not already set up
5. Go to "Sign-in method" tab
6. Enable "Email/Password" provider
7. Save changes

### 2. Firestore Database
**Status**: ❓ Need to verify
**Required**: Firestore database created with proper rules

**To check/enable:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `aquaconnect-e6b86`
3. Click "Firestore Database" in the left sidebar
4. Click "Create database" if not already created
5. Choose "Start in test mode" for development
6. Select a location (choose closest to your users)

### 3. Firestore Rules
**Status**: ❓ Need to verify
**Required**: Rules that allow authenticated users to read/write

**Current rules should be:**
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

**To update rules:**
1. Go to Firestore Database
2. Click "Rules" tab
3. Replace with the rules above
4. Click "Publish"

## 🧪 Testing Your Setup

### Step 1: Use the Test Button
1. Open your app
2. Go to the signup screen
3. Tap the "🧪 Test Firebase Connection" button
4. Check the results

### Step 2: Check Console Logs
1. Press `j` in your terminal to open debugger
2. Look for Firebase initialization messages
3. Check for any error messages

### Step 3: Try Manual Signup
1. Fill in the signup form
2. Try to create an account
3. Check for specific error messages

## 🚨 Common Issues & Solutions

### Issue 1: "auth/operation-not-allowed"
**Cause**: Email/Password authentication not enabled
**Solution**: Enable Email/Password in Firebase Console → Authentication → Sign-in methods

### Issue 2: "permission-denied"
**Cause**: Firestore rules too restrictive
**Solution**: Update Firestore rules to allow authenticated users

### Issue 3: "auth/invalid-api-key"
**Cause**: Wrong API key or project not set up
**Solution**: Verify your Firebase project configuration

### Issue 4: "auth/network-request-failed"
**Cause**: Network connectivity issues
**Solution**: Check internet connection and try again

## 📱 Next Steps

1. **Verify Firebase services** are enabled (Authentication & Firestore)
2. **Test the connection** using the test button in the app
3. **Try signup** with a real email and password
4. **Check console logs** for any error messages
5. **Share any errors** you encounter

## 🔧 Quick Fix Commands

If you need to restart everything:
```bash
# Stop the development server
Ctrl+C

# Clear cache and restart
npx expo start --clear

# Or restart with fresh cache
npm start
```

Your Firebase configuration is correct - the issue is likely with the Firebase project services not being enabled. Follow the verification steps above!
