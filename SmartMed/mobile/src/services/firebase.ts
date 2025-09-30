import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const initializeFirebase = async () => {
  try {
    // Firebase is already initialized when the app starts
    // This function can be used for additional setup if needed
    console.log('Firebase initialized');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

export { auth, firestore, storage };

// Firebase collections
export const COLLECTIONS = {
  USERS: 'users',
  MEDICATIONS: 'medications',
  SUPPLEMENTS: 'supplements',
  INTERACTIONS: 'interactions',
  ALERTS: 'alerts',
  OCR_RESULTS: 'ocrResults',
} as const;

// Helper functions
export const getCurrentUser = () => {
  return auth().currentUser;
};

export const getCurrentUserId = () => {
  const user = auth().currentUser;
  return user?.uid || null;
};
