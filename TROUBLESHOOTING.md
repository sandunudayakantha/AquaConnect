# 🔧 Troubleshooting: Firebase Signup Issues

## ❌ Current Problem
Signup is failing with Firebase configuration errors.

## 🔍 Quick Diagnosis

### Step 1: Check Console Logs
1. Open your app
2. Open developer tools (press `j` in terminal)
3. Look for Firebase configuration logs
4. Check for any error messages

### Step 2: Verify .env File
You need to create a `.env` file in your project root with your Firebase configuration.

## ✅ Solution: Create .env File

### Option 1: Manual Creation
1. Create a file named `.env` in your project root (same level as `package.json`)
2. Add your Firebase configuration:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Option 2: Copy from firebase.config.example
1. Copy `firebase.config.example` to `.env`
2. Replace placeholder values with your actual Firebase config

## 🔥 Get Firebase Configuration

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "AquaConnect"
4. Follow the setup wizard

### Step 2: Enable Services
1. **Authentication**: 
   - Click "Authentication" → "Get started"
   - Enable "Email/Password" sign-in method
   
2. **Firestore Database**:
   - Click "Firestore Database" → "Create database"
   - Choose "Start in test mode"
   - Select a location

### Step 3: Get Configuration
1. Click gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll to "Your apps" section
4. Click "Add app" → Web icon (</>)
5. Register app as "AquaConnect"
6. Copy the configuration object

### Step 4: Update .env File
Replace the placeholder values in your `.env` file with the actual values from Firebase Console.

## 🧪 Test the Setup

### Step 1: Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm start
```

### Step 2: Check Console Logs
Look for these success messages:
- ✅ Firebase configuration looks good!
- ✅ Firebase initialized successfully!

### Step 3: Test Signup
1. Go through splash screens
2. Try to create a new account
3. Check for any error messages

## 🚨 Common Issues

### Issue 1: "Configuration not found"
**Cause**: Missing or incorrect .env file
**Solution**: Create .env file with correct Firebase config

### Issue 2: "Permission denied"
**Cause**: Firestore rules too restrictive
**Solution**: Update Firestore rules to allow authenticated users

### Issue 3: "Network error"
**Cause**: Internet connection or Firebase project issues
**Solution**: Check internet connection and Firebase project status

## 📱 Debug Steps

1. **Check .env file exists**: `ls -la | grep .env`
2. **Check .env content**: `cat .env` (if it exists)
3. **Check console logs**: Look for Firebase initialization messages
4. **Test Firebase connection**: Try signup and check error messages

## 🆘 Still Having Issues?

If you're still having problems:

1. **Share console logs**: Copy any error messages
2. **Check .env file**: Make sure it exists and has correct values
3. **Verify Firebase project**: Ensure Authentication and Firestore are enabled
4. **Restart everything**: Stop server, clear cache, restart

## 📞 Need Help?

1. Check the `FIREBASE_SETUP.md` file for detailed instructions
2. Look at `firebase.config.example` for configuration format
3. Make sure your Firebase project is properly set up
4. Verify all environment variables are correctly set

The key is having a properly configured `.env` file with your actual Firebase project credentials!
