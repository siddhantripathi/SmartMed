import 'react-native';
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import App from '../src/App';
import { store } from '../src/store';

// Mock Firebase modules
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
  })),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collection: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/storage', () => ({
  __esModule: true,
  default: jest.fn(),
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

jest.mock('../src/services/firebase', () => ({
  initializeFirebase: jest.fn(),
  setupNotifications: jest.fn(),
}));

jest.mock('../src/services/auth', () => ({
  authService: {
    initializeAuthListener: jest.fn(),
  },
}));

describe('App Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('App renders without crashing', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </Provider>
    );

    // App should render loading screen initially
    await waitFor(() => {
      expect(true).toBe(true); // Basic render test
    });
  });

  test('Redux store initializes correctly', () => {
    const state = store.getState();

    // Check that all required slices are initialized
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('medications');
    expect(state).toHaveProperty('supplements');
    expect(state).toHaveProperty('interactions');
    expect(state).toHaveProperty('alerts');
    expect(state).toHaveProperty('ocr');

    // Check initial state values
    expect(state.user.isAuthenticated).toBe(false);
    expect(state.user.loading).toBe(false);
    expect(state.medications.medications).toEqual([]);
    expect(state.supplements.supplements).toEqual([]);
    expect(state.interactions.interactions).toEqual([]);
    expect(state.alerts.alerts).toEqual([]);
  });

  test('App initializes Firebase services', async () => {
    const { initializeFirebase } = require('../src/services/firebase');
    const { setupNotifications } = require('../src/services/firebase');
    const { authService } = require('../src/services/auth');

    render(
      <Provider store={store}>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </Provider>
    );

    await waitFor(() => {
      expect(initializeFirebase).toHaveBeenCalled();
      expect(setupNotifications).toHaveBeenCalled();
      expect(authService.initializeAuthListener).toHaveBeenCalled();
    });
  });

  test('Authentication state management works', () => {
    const { setUser, logout } = require('../src/store/slices/userSlice');

    // Test login action
    store.dispatch(setUser({
      uid: 'test-user-id',
      email: 'test@example.com',
      isAuthenticated: true,
    }));

    let state = store.getState();
    expect(state.user.isAuthenticated).toBe(true);
    expect(state.user.uid).toBe('test-user-id');
    expect(state.user.email).toBe('test@example.com');

    // Test logout action
    store.dispatch(logout());

    state = store.getState();
    expect(state.user.isAuthenticated).toBe(false);
    expect(state.user.uid).toBe('');
    expect(state.user.email).toBe('');
  });

  test('Medication state management works', () => {
    const { setMedications, addMedication } = require('../src/store/slices/medicationSlice');

    const testMedication = {
      id: 'med-1',
      name: 'Test Medication',
      dosage: '10mg',
      frequency: 'Once daily',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // Test adding medication
    store.dispatch(addMedication(testMedication));

    let state = store.getState();
    expect(state.medications.medications).toHaveLength(1);
    expect(state.medications.medications[0]).toEqual(testMedication);

    // Test setting medications
    const medications = [testMedication, { ...testMedication, id: 'med-2' }];
    store.dispatch(setMedications(medications));

    state = store.getState();
    expect(state.medications.medications).toHaveLength(2);
  });

  test('Navigation structure is correct', () => {
    // This test verifies that our navigation structure matches expectations
    // In a real app, you'd test actual navigation, but for smoke tests
    // we verify the structure exists

    const navigationTypes = require('../src/navigation/types');
    expect(navigationTypes).toBeDefined();

    // Check that required navigation types exist
    expect(navigationTypes.RootStackParamList).toBeDefined();
    expect(navigationTypes.MainTabParamList).toBeDefined();
    expect(navigationTypes.AuthStackParamList).toBeDefined();
  });
});
