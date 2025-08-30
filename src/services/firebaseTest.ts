import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase Connection...');
  
  try {
    // Test 1: Check if Firebase is initialized
    if (!auth || !db) {
      console.error('❌ Firebase not initialized');
      return false;
    }
    
    console.log('✅ Firebase services initialized');
    
    // Test 2: Try to create a test user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    console.log('📝 Creating test user...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;
    
    console.log('✅ Test user created:', user.uid);
    
    // Test 3: Try to write to Firestore
    console.log('📝 Writing to Firestore...');
    await setDoc(doc(db, 'test', user.uid), {
      email: testEmail,
      createdAt: new Date(),
      test: true
    });
    
    console.log('✅ Firestore write successful');
    
    // Test 4: Try to read from Firestore
    console.log('📖 Reading from Firestore...');
    const docRef = doc(db, 'test', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('✅ Firestore read successful:', docSnap.data());
    } else {
      console.log('❌ Document not found');
    }
    
    // Test 5: Try to sign in
    console.log('🔐 Testing sign in...');
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Sign in successful');
    
    // Clean up: Delete the test user (optional)
    console.log('🧹 Cleaning up test user...');
    await user.delete();
    console.log('✅ Test user deleted');
    
    console.log('🎉 All Firebase tests passed!');
    return true;
    
  } catch (error: any) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide specific guidance based on error
    if (error.code === 'auth/operation-not-allowed') {
      console.error('💡 Solution: Enable Email/Password authentication in Firebase Console');
    } else if (error.code === 'permission-denied') {
      console.error('💡 Solution: Update Firestore rules to allow authenticated users');
    } else if (error.code === 'auth/invalid-api-key') {
      console.error('💡 Solution: Check your Firebase API key in .env file');
    }
    
    return false;
  }
};
