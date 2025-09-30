// Firebase configuration for different environments

export const firebaseConfig = {
  development: {
    // Use Firebase emulators in development
    apiKey: "demo-api-key",
    authDomain: "localhost:9099", // Auth emulator
    projectId: "smartmed-dev",
    storageBucket: "localhost:9199", // Storage emulator
    messagingSenderId: "demo-sender-id",
    appId: "demo-app-id",
  },
  production: {
    // Production Firebase config (to be filled in)
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  }
};

// Get current environment
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Get Firebase config based on environment
export const getFirebaseConfig = () => {
  return isDevelopment ? firebaseConfig.development : firebaseConfig.production;
};

// Emulator configuration
export const useEmulators = isDevelopment;

export const emulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9099,
  },
  firestore: {
    host: 'localhost',
    port: 8080,
  },
  storage: {
    host: 'localhost',
    port: 9199,
  },
  functions: {
    host: 'localhost',
    port: 5001,
  },
};
