# SmartMed - Smart Medication Interaction Checker

A comprehensive mobile application that provides real-time medication and supplement interaction checking with AI-powered natural language processing, OCR capabilities, and personalized health alerts.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **React Native development environment**
- **Firebase CLI**
- **Google Cloud Platform account**
- **Android Studio** (for Android development)

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd SmartMed

# Install dependencies
npm install

# Set up mobile app
cd mobile
npm install
cd ..

# Set up Firebase functions
cd functions
npm install
cd ..
```

### 2. Firebase Configuration

1. **Create a Firebase project** at https://console.firebase.google.com/
2. **Enable required services:**
   - Authentication
   - Firestore
   - Storage
   - Cloud Functions
   - Cloud Messaging

3. **Configure Firebase:**
```bash
# Login to Firebase
firebase login

# Initialize Firebase in the project
firebase init

# Select: Functions, Firestore, Storage
# Choose existing project or create new one
```

4. **Update configuration files:**
   - Copy `.env.example` to `.env` and fill in your Firebase config
   - Update `firebase.json` with your project settings

### 3. Start Development Environment

#### Option A: Using Scripts (Recommended)

```bash
# Start Firebase emulators and mobile app
./scripts/setup-emulators.sh

# In another terminal, start Android emulator
./scripts/setup-android-emulator.sh
```

#### Option B: Manual Setup

```bash
# Terminal 1: Start Firebase emulators
firebase emulators:start --only firestore,auth,functions,storage

# Terminal 2: Start React Native Metro bundler
cd mobile && npm start

# Terminal 3: Start Android emulator
# Using Android Studio or command line
```

### 4. Deploy to Production

```bash
# Deploy Firebase functions and rules
firebase deploy

# Build and deploy mobile app (separate process)
cd mobile
npm run build:android  # or build:ios
```

## 📱 Mobile App Development

### Project Structure

```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── services/       # Firebase services and API calls
│   ├── store/          # Redux store configuration
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   └── navigation/     # Navigation configuration
├── android/            # Android-specific files
├── ios/                # iOS-specific files
└── __tests__/          # Test files
```

### Key Features Implemented

- **Authentication**: Email/password and social login
- **Medication Management**: Add, edit, delete medications
- **Supplement Tracking**: Manage dietary supplements
- **OCR Scanning**: Camera integration for medication labels
- **Interaction Checking**: Real-time drug interaction analysis
- **Alert System**: Personalized health notifications
- **Offline Support**: Works without internet connection

### Running Tests

```bash
cd mobile
npm test                    # Run Jest tests
npm run typecheck          # TypeScript type checking
npm run lint               # ESLint code quality
```

## ☁️ Backend Services

### Firebase Cloud Functions

Located in the `functions/` directory:

- **User Management**: Profile creation and updates
- **Medication CRUD**: Add, update, delete medications
- **Interaction Analysis**: Check drug interactions
- **OCR Processing**: Process medication images
- **Alert Generation**: Create personalized alerts

### n8n Workflows

Located in the `n8n-workflows/` directory:

- **Drug Interaction Check**: Automated interaction analysis
- **OCR Processing**: Image text extraction and validation

### Google Cloud Run

n8n is deployed as a containerized service:

```bash
# Deploy n8n
./scripts/deploy-n8n.sh [project-id]

# Update workflows in n8n admin panel
# Import JSON workflow files
```

## 🔧 Development Guidelines

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Redux**: State management with Redux Toolkit
- **React Navigation**: Navigation between screens

### Emulator Configuration

- **Primary Device**: Android Medium Phone (API 34, 6.0" 1080x2340)
- **RAM**: 4GB minimum for optimal performance
- **Storage**: 8GB for app data and offline capabilities

### Firebase Emulator Setup

```bash
# Start all emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only firestore,auth,functions

# Access emulator UI
open http://localhost:4000
```

## 🔒 Security & Compliance

### Data Protection

- **End-to-end encryption** for sensitive health data
- **HIPAA-compliant** data handling procedures
- **Firebase Security Rules** for access control
- **Secure API key management** with Google Secret Manager

### Privacy Measures

- **Minimal data collection** principle
- **User consent management**
- **Data anonymization** for analytics
- **GDPR compliance** with right to deletion

## 📋 API Integrations

### Medical APIs

- **FDA Orange Book API**: Drug approval information
- **RxNorm API**: Standardized medication names
- **NIH DailyMed API**: Medication labeling and interactions
- **OpenFDA API**: Adverse event reporting

### AI/ML Services

- **Google Cloud Vision API**: OCR for medication labels
- **Vertex AI PaLM 2**: Natural language processing
- **Vertex AI Vector Search**: Semantic search capabilities

## 🚀 Deployment

### Mobile App

```bash
# Android
cd mobile/android && ./gradlew assembleRelease

# iOS (requires macOS)
cd mobile/ios && xcodebuild -workspace SmartMed.xcworkspace -scheme SmartMed -configuration Release -destination generic/platform=iOS -archivePath SmartMed.xcarchive archive
```

### Backend

```bash
# Deploy Firebase functions and rules
firebase deploy

# Deploy n8n workflows
# Import workflow JSON files in n8n admin panel
```

## 📊 Monitoring & Analytics

- **Firebase Crashlytics**: Crash reporting and performance
- **Google Cloud Monitoring**: Infrastructure monitoring
- **Firebase Analytics**: User engagement tracking
- **Custom dashboards**: Medical API response times

## 🔄 Development Workflow

1. **Make changes** to code
2. **Test locally** with Firebase emulators
3. **Run tests** and type checking
4. **Commit changes** with conventional commits
5. **Deploy to staging** for testing
6. **Deploy to production** after approval

## 📚 Documentation

- **API Documentation**: Available in `/docs` folder
- **Component Documentation**: Inline comments in code
- **Deployment Guide**: This README and scripts
- **Architecture Decisions**: Documented in `.cursorrules`

## 🧪 Testing

### Smoke Tests

Run comprehensive smoke tests to verify critical functionality:

```bash
# Run all smoke tests
./scripts/run-smoke-tests.sh

# Run mobile app smoke tests only
cd mobile && npm run test:smoke

# Run Firebase functions smoke tests only
cd functions && npm test -- --testPathPattern=smoke
```

**Smoke tests verify:**
- ✅ App launches without crashing
- ✅ Redux store initializes correctly
- ✅ Firebase services connect properly
- ✅ Authentication flows work
- ✅ CRUD operations function
- ✅ Error handling is implemented

See [SMOKE_TESTS.md](SMOKE_TESTS.md) for detailed test documentation.

## 🆘 Troubleshooting

### Common Issues

1. **Metro bundler not starting**
   ```bash
   cd mobile && npx react-native start --reset-cache
   ```

2. **Firebase emulator connection issues**
   ```bash
   firebase emulators:stop
   firebase emulators:start
   ```

3. **Android emulator not starting**
   ```bash
   # Kill existing emulators
   adb kill-server
   adb start-server

   # Restart emulator
   ./scripts/setup-android-emulator.sh
   ```

4. **Smoke tests failing**
   ```bash
   # Check test output for details
   cd mobile && npm run test:smoke -- --verbose

   # Ensure all dependencies are installed
   npm install && cd mobile && npm install && cd functions && npm install
   ```

### Getting Help

- Check the Firebase console for error logs
- Review Cloud Run logs for n8n issues
- Check the troubleshooting guide in `/docs`

## 📄 License

This project is developed for healthcare purposes. Ensure compliance with medical device regulations and data protection laws in your jurisdiction.

---

**SmartMed** - Your trusted medication interaction checker 🏥💊