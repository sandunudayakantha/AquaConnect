# 🔥 Quick Fix: Update Firestore Rules

## ❌ Current Issue
You're getting: `[FirebaseError: Missing or insufficient permissions.]`

## ✅ Solution: Update Firestore Rules

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Select your project: `aquaconnect-e6b86`
3. Click "Firestore Database" in the left sidebar

### Step 2: Update Rules
1. Click the "Rules" tab
2. **Delete all existing rules**
3. **Copy and paste these rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write all documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

### Step 3: Wait & Test
1. **Wait 1-2 minutes** for rules to propagate
2. **Try the test button** in your app
3. **Try signing up** with a new account

## 🚨 Alternative: Test Mode (Less Secure)
If you want to allow all access for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📱 What I Fixed in the Code
I've updated the authentication service to:
- Handle Firestore permission errors gracefully
- Return basic user info when Firestore is not accessible
- Provide better error messages

## 🧪 Test Now
After updating the rules:
1. Open your app
2. Go to signup screen
3. Tap "🧪 Test Firebase Connection"
4. Try creating a new account

The signup should work now! 🎉
