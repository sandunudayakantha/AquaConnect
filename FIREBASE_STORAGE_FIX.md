# 🔥 Firebase Storage Fix Guide

## ❌ Current Issue
You're getting: `Firebase Storage: An unknown error occurred, please check the error payload for server response. (storage/unknown)`

## ✅ Solution Steps

### Step 1: Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `aquaconnect-e6b86`
3. Click **"Storage"** in the left sidebar
4. If not enabled, click **"Get started"**
5. Choose **"Start in test mode"** for development
6. Select a location close to your users
7. Click **"Done"**

### Step 2: Update Firebase Storage Rules
1. In Firebase Console, go to **Storage**
2. Click the **"Rules"** tab
3. **Replace the existing rules** with these:

```javascript
rules_version = '2';

// Allow authenticated users to upload and read their own files
service firebase.storage {
  match /b/{bucket}/o {
    // Reports folder - authenticated users can upload, anyone can read
    match /reports/{reportId}/{allPaths=**} {
      allow read: if true; // Public read for reports
      allow write: if request.auth != null; // Only authenticated users can upload
    }
    
    // User profile images (if needed later)
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click **"Publish"**
5. **Wait 1-2 minutes** for rules to propagate

### Step 3: Alternative - Test Mode Rules (Less Secure)
If you want to allow all access for development testing:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 4: Verify Storage Bucket Configuration
1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps" section
3. Make sure your **Storage Bucket** is set correctly:
   - Should be: `aquaconnect-e6b86.firebasestorage.app`
   - Or similar format: `your-project-id.appspot.com`

### Step 5: Check Your Environment Variables
Make sure your `.env` file includes the storage bucket:

```env
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=aquaconnect-e6b86.firebasestorage.app
```

### Step 6: Clear Cache and Restart
1. Stop your development server (Ctrl+C)
2. Clear cache: `npx expo start --clear`
3. Test photo upload again

## 🔍 Debugging Steps

### Check Console Logs
The updated code now provides detailed logging. Look for:
- `📤 Starting photo upload process...`
- `📷 Processing photo X/Y...`
- `📦 Blob created for photo...`
- `📁 Storage reference created...`
- `⬆️ Uploading photo...`

### Common Error Messages & Solutions

#### `storage/unauthorized`
- **Cause**: Storage rules don't allow the operation
- **Fix**: Update Storage rules (Step 2)

#### `storage/unknown`
- **Cause**: Storage not enabled or misconfigured
- **Fix**: Enable Storage (Step 1) and check bucket name

#### `storage/quota-exceeded`
- **Cause**: Storage quota exceeded
- **Fix**: Upgrade Firebase plan or clean up old files

#### `Failed to fetch image`
- **Cause**: Invalid image URI from ImagePicker
- **Fix**: Check ImagePicker configuration

## 🧪 Test the Fix

1. **Submit a report with photos**
2. **Check the detailed console logs**
3. **Verify photos appear in Firebase Storage Console**
4. **Confirm download URLs are generated**

## 📱 What This Enables

Once fixed, you'll have:
- ✅ Photo uploads to Firebase Storage
- ✅ Automatic download URL generation
- ✅ Organized file structure (`reports/reportId/photo_X_timestamp.jpg`)
- ✅ Proper error handling and logging
- ✅ Metadata tracking (report ID, upload time)

## 🚨 Security Note

The rules above allow:
- **Public read** access to report photos (so they can be viewed by organizations)
- **Authenticated write** access (only logged-in users can upload)

For production, you may want to add more specific rules based on user roles.
