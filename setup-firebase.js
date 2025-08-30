#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper for AquaConnect');
console.log('==========================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists!');
  console.log('📝 Current .env content:');
  console.log('------------------------');
  console.log(fs.readFileSync(envPath, 'utf8'));
  console.log('------------------------\n');
} else {
  console.log('❌ .env file not found!');
  console.log('📝 Creating .env file template...\n');
  
  const envTemplate = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration
# Get these from: https://console.firebase.google.com/

EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.aquaconnect.com

# Maps Configuration (for future use)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Other Configuration
EXPO_PUBLIC_APP_ENV=development
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file template!');
  console.log('📝 Please edit the .env file with your actual Firebase configuration.\n');
}

console.log('🔧 Next Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Authentication (Email/Password)');
console.log('4. Enable Firestore Database');
console.log('5. Add a web app and copy the configuration');
console.log('6. Update the .env file with your Firebase config');
console.log('7. Restart your development server (npm start)');
console.log('\n📋 See FIREBASE_SETUP.md for detailed instructions');
console.log('📋 See firebase.config.example for configuration format');
