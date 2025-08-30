# AquaConnect

A React Native mobile application built with Expo, designed to connect water-related services and communities.

## 🚀 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **AsyncStorage** - Local data persistence
- **React Native Maps** - Map integration
- **ESLint + Prettier** - Code quality and formatting

## 📁 Project Structure

```
AquaConnect/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── context/        # React Context providers
│   ├── services/       # API, Firebase, and other services
│   └── styles/         # Global styles and themes
├── assets/
│   ├── images/         # Image assets
│   ├── icons/          # Icon assets
│   └── splash/         # Splash screen assets
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
└── app.json           # Expo configuration
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AquaConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Development Commands

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Add your Firebase configuration to the `.env` file
4. Update the configuration in `src/services/firebase.ts`

### ESLint & Prettier

The project includes pre-configured ESLint and Prettier settings for consistent code quality:
- TypeScript support
- React Native specific rules
- Automatic code formatting
- Import sorting

## 📱 Features (Planned)

### Sprint 0 ✅
- [x] Project setup and configuration
- [x] Folder structure
- [x] Dependencies installation
- [x] Firebase configuration
- [x] ESLint + Prettier setup
- [x] Basic documentation

### Future Sprints
- Sprint 1: Authentication & User Management
- Sprint 2: Core Features
- Sprint 3: Maps & Location Services
- Sprint 4: Offline Support
- Sprint 5: Testing & Optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@aquaconnect.com or create an issue in the repository.
