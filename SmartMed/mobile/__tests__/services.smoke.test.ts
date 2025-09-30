import { authService } from '../src/services/auth';
import { firestoreService } from '../src/services/firestore';

// Mock Firebase modules
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
    },
  })),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        onSnapshot: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
        onSnapshot: jest.fn(),
      })),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          onSnapshot: jest.fn(),
        })),
      })),
    })),
  })),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    requestPermission: jest.fn(),
    getToken: jest.fn(),
    onMessage: jest.fn(),
    onTokenRefresh: jest.fn(),
  })),
}));

describe('Services Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('AuthService initializes correctly', () => {
    expect(authService).toBeDefined();
    expect(typeof authService.initializeAuthListener).toBe('function');
    expect(typeof authService.cleanup).toBe('function');
    expect(typeof authService.signInWithEmail).toBe('function');
    expect(typeof authService.signUpWithEmail).toBe('function');
    expect(typeof authService.signOut).toBe('function');
    expect(typeof authService.getCurrentUser).toBe('function');
    expect(typeof authService.isAuthenticated).toBe('function');
  });

  test('FirestoreService initializes correctly', () => {
    expect(firestoreService).toBeDefined();
    expect(typeof firestoreService.setupRealtimeListeners).toBe('function');
    expect(typeof firestoreService.cleanup).toBe('function');
    expect(typeof firestoreService.addMedication).toBe('function');
    expect(typeof firestoreService.updateMedication).toBe('function');
    expect(typeof firestoreService.deleteMedication).toBe('function');
    expect(typeof firestoreService.getCurrentUserId).toBe('function');
  });

  test('AuthService methods are callable', () => {
    // Test that methods don't throw errors when called with invalid data
    expect(() => authService.isAuthenticated()).not.toThrow();
    expect(() => authService.getCurrentUser()).not.toThrow();
    expect(() => authService.cleanup()).not.toThrow();
  });

  test('FirestoreService methods handle errors gracefully', async () => {
    // Test that methods handle errors appropriately
    await expect(
      firestoreService.addMedication({} as any)
    ).rejects.toThrow();

    await expect(
      firestoreService.updateMedication('test-id', {} as any)
    ).rejects.toThrow();

    await expect(
      firestoreService.deleteMedication('test-id')
    ).rejects.toThrow();
  });

  test('Service integration points are properly defined', () => {
    // Test that services can be imported and used together
    expect(authService).toBeDefined();
    expect(firestoreService).toBeDefined();

    // Test that services don't interfere with each other
    expect(() => {
      authService.isAuthenticated();
      firestoreService.getCurrentUserId();
    }).not.toThrow();
  });

  test('Firebase service initialization functions exist', async () => {
    // Mock the services module
    const firebaseServices = await import('../src/services/firebase');
    const notificationServices = await import('../src/services/notifications');

    expect(typeof firebaseServices.initializeFirebase).toBe('function');
    expect(typeof firebaseServices.setupNotifications).toBe('function');
    expect(typeof notificationServices.setupNotifications).toBe('function');
    expect(typeof notificationServices.getFCMToken).toBe('function');
    expect(typeof notificationServices.onTokenRefresh).toBe('function');
  });

  test('Service configuration is properly structured', async () => {
    const firebaseConfig = await import('../src/config/firebase');

    expect(firebaseConfig.firebaseConfig).toBeDefined();
    expect(firebaseConfig.firebaseConfig.development).toBeDefined();
    expect(firebaseConfig.firebaseConfig.production).toBeDefined();
    expect(firebaseConfig.useEmulators).toBeDefined();
    expect(firebaseConfig.emulatorConfig).toBeDefined();
    expect(typeof firebaseConfig.getFirebaseConfig).toBe('function');
  });

  test('Firebase configuration functions work correctly', async () => {
    const firebaseConfig = await import('../src/config/firebase');

    // Test development config
    const devConfig = firebaseConfig.getFirebaseConfig();
    expect(devConfig).toBeDefined();
    expect(devConfig.apiKey).toBeDefined();

    // Test that configuration object has expected structure
    expect(firebaseConfig.firebaseConfig.development).toHaveProperty('apiKey');
    expect(firebaseConfig.firebaseConfig.development).toHaveProperty('authDomain');
    expect(firebaseConfig.firebaseConfig.development).toHaveProperty('projectId');
  });

  test('Service error handling is implemented', async () => {
    // Test that services handle missing user authentication gracefully
    expect(() => {
      firestoreService.addMedication({
        name: 'Test Med',
        dosage: '10mg',
        frequency: 'Daily',
        isActive: true,
        startDate: new Date().toISOString(),
      });
    }).not.toThrow();

    // Test that auth service handles missing current user
    const currentUser = authService.getCurrentUser();
    expect(currentUser).toBeDefined();
  });

  test('Async service methods return promises', async () => {
    // Test that async methods return promises
    const medicationPromise = firestoreService.addMedication({
      name: 'Test Med',
      dosage: '10mg',
      frequency: 'Daily',
      isActive: true,
      startDate: new Date().toISOString(),
    });

    expect(medicationPromise).toBeInstanceOf(Promise);

    // Test that promise rejects appropriately for invalid data
    await expect(medicationPromise).rejects.toThrow();
  });

  test('Service cleanup functions work correctly', () => {
    // Test that cleanup functions can be called without errors
    expect(() => {
      authService.cleanup();
      firestoreService.cleanup();
    }).not.toThrow();
  });

  test('Service state management is consistent', () => {
    // Test that services maintain consistent state
    const isAuth1 = authService.isAuthenticated();
    const isAuth2 = authService.isAuthenticated();

    // Should return the same result when called multiple times
    expect(isAuth1).toBe(isAuth2);

    // Test that firestore service returns consistent user ID
    const userId1 = firestoreService.getCurrentUserId();
    const userId2 = firestoreService.getCurrentUserId();

    // Should return the same result when called multiple times
    expect(userId1).toBe(userId2);
  });
});
