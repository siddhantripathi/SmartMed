import { store } from '../src/store';
import * as userSlice from '../src/store/slices/userSlice';
import * as medicationSlice from '../src/store/slices/medicationSlice';
import * as supplementSlice from '../src/store/slices/supplementSlice';
import * as interactionSlice from '../src/store/slices/interactionSlice';
import * as alertSlice from '../src/store/slices/alertSlice';
import * as ocrSlice from '../src/store/slices/ocrSlice';

describe('Redux Store Smoke Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    store.dispatch(userSlice.logout());
    store.dispatch(medicationSlice.setMedications([]));
    store.dispatch(supplementSlice.setSupplements([]));
    store.dispatch(interactionSlice.setInteractions([]));
    store.dispatch(alertSlice.setAlerts([]));
    store.dispatch(ocrSlice.setCurrentSession(null));
  });

  test('Store initializes with correct initial state', () => {
    const state = store.getState();

    // Check that all slices are properly initialized
    expect(state.user).toBeDefined();
    expect(state.medications).toBeDefined();
    expect(state.supplements).toBeDefined();
    expect(state.interactions).toBeDefined();
    expect(state.alerts).toBeDefined();
    expect(state.ocr).toBeDefined();
  });

  test('User slice state management works correctly', () => {
    // Test initial state
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBe(null);

    // Test login
    store.dispatch(userSlice.setUser({
      uid: 'test-user-id',
      email: 'test@example.com',
      isAuthenticated: true,
    }));

    let state = store.getState();
    expect(state.user.isAuthenticated).toBe(true);
    expect(state.user.uid).toBe('test-user-id');
    expect(state.user.email).toBe('test@example.com');
    expect(state.user.loading).toBe(false);
    expect(state.user.error).toBe(null);

    // Test profile update
    store.dispatch(userSlice.updateProfile({
      firstName: 'John',
      lastName: 'Doe',
    }));

    state = store.getState();
    expect(state.user.profile.firstName).toBe('John');
    expect(state.user.profile.lastName).toBe('Doe');

    // Test logout
    store.dispatch(userSlice.logout());

    state = store.getState();
    expect(state.user.isAuthenticated).toBe(false);
    expect(state.user.uid).toBe('');
    expect(state.user.email).toBe('');
  });

  test('Medication slice state management works correctly', () => {
    // Test initial state
    expect(store.getState().medications.medications).toEqual([]);
    expect(store.getState().medications.loading).toBe(false);
    expect(store.getState().medications.error).toBe(null);

    // Test adding medication
    const testMedication = {
      id: 'med-1',
      name: 'Test Medication',
      dosage: '10mg',
      frequency: 'Once daily',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    store.dispatch(medicationSlice.addMedication(testMedication));

    let state = store.getState();
    expect(state.medications.medications).toHaveLength(1);
    expect(state.medications.medications[0]).toEqual(testMedication);

    // Test setting medications
    const medications = [
      testMedication,
      { ...testMedication, id: 'med-2', name: 'Another Medication' }
    ];
    store.dispatch(medicationSlice.setMedications(medications));

    state = store.getState();
    expect(state.medications.medications).toHaveLength(2);

    // Test updating medication
    store.dispatch(medicationSlice.updateMedication({
      id: 'med-1',
      updates: { dosage: '20mg' }
    }));

    state = store.getState();
    expect(state.medications.medications[0].dosage).toBe('20mg');

    // Test deleting medication
    store.dispatch(medicationSlice.deleteMedication('med-2'));

    state = store.getState();
    expect(state.medications.medications).toHaveLength(1);
    expect(state.medications.medications[0].id).toBe('med-1');
  });

  test('Supplement slice state management works correctly', () => {
    // Test initial state
    expect(store.getState().supplements.supplements).toEqual([]);
    expect(store.getState().supplements.loading).toBe(false);

    // Test adding supplement
    const testSupplement = {
      id: 'supp-1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      category: 'vitamin' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    store.dispatch(supplementSlice.addSupplement(testSupplement));

    let state = store.getState();
    expect(state.supplements.supplements).toHaveLength(1);
    expect(state.supplements.supplements[0]).toEqual(testSupplement);

    // Test updating supplement
    store.dispatch(supplementSlice.updateSupplement({
      id: 'supp-1',
      updates: { dosage: '2000 IU' }
    }));

    state = store.getState();
    expect(state.supplements.supplements[0].dosage).toBe('2000 IU');

    // Test deleting supplement
    store.dispatch(supplementSlice.deleteSupplement('supp-1'));

    state = store.getState();
    expect(state.supplements.supplements).toHaveLength(0);
  });

  test('Interaction slice state management works correctly', () => {
    // Test initial state
    expect(store.getState().interactions.interactions).toEqual([]);
    expect(store.getState().interactions.currentCheck).toEqual([]);
    expect(store.getState().interactions.loading).toBe(false);

    // Test setting interactions
    const testInteractions = [
      {
        id: 'interaction-1',
        medicationName: 'Medication A',
        supplementName: 'Supplement B',
        severityLevel: 'medium' as const,
        description: 'Potential interaction',
        recommendation: 'Monitor closely',
        source: 'Medical Database',
        lastUpdated: new Date().toISOString(),
      }
    ];

    store.dispatch(interactionSlice.setInteractions(testInteractions));

    let state = store.getState();
    expect(state.interactions.interactions).toHaveLength(1);
    expect(state.interactions.interactions[0]).toEqual(testInteractions[0]);

    // Test setting current check
    store.dispatch(interactionSlice.setCurrentCheck(testInteractions));

    state = store.getState();
    expect(state.interactions.currentCheck).toHaveLength(1);
  });

  test('Alert slice state management works correctly', () => {
    // Test initial state
    expect(store.getState().alerts.alerts).toEqual([]);
    expect(store.getState().alerts.unreadCount).toBe(0);
    expect(store.getState().alerts.loading).toBe(false);

    // Test adding alert
    const testAlert = {
      id: 'alert-1',
      interactionId: 'interaction-1',
      alertType: 'interaction' as const,
      message: 'Potential drug interaction detected',
      severityLevel: 'medium' as const,
      isRead: false,
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    };

    store.dispatch(alertSlice.addAlert(testAlert));

    let state = store.getState();
    expect(state.alerts.alerts).toHaveLength(1);
    expect(state.alerts.unreadCount).toBe(1);

    // Test marking as read
    store.dispatch(alertSlice.markAsRead('alert-1'));

    state = store.getState();
    expect(state.alerts.alerts[0].isRead).toBe(true);
    expect(state.alerts.unreadCount).toBe(0);

    // Test acknowledging
    store.dispatch(alertSlice.markAsAcknowledged('alert-1'));

    state = store.getState();
    expect(state.alerts.alerts[0].isAcknowledged).toBe(true);

    // Test deleting alert
    store.dispatch(alertSlice.deleteAlert('alert-1'));

    state = store.getState();
    expect(state.alerts.alerts).toHaveLength(0);
  });

  test('OCR slice state management works correctly', () => {
    // Test initial state
    expect(store.getState().ocr.currentSession).toBe(null);
    expect(store.getState().ocr.history).toEqual([]);
    expect(store.getState().ocr.loading).toBe(false);

    // Test setting current session
    const testSession = {
      sessionId: 'session-1',
      extractedText: 'Test medication label',
      medications: [],
      confidence: 0.8,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
    };

    store.dispatch(ocrSlice.setCurrentSession(testSession));

    let state = store.getState();
    expect(state.ocr.currentSession).toEqual(testSession);

    // Test updating session status
    store.dispatch(ocrSlice.updateSessionStatus({
      sessionId: 'session-1',
      status: 'processing'
    }));

    state = store.getState();
    expect(state.ocr.currentSession?.status).toBe('processing');

    // Test adding to history
    store.dispatch(ocrSlice.addToHistory(testSession));

    state = store.getState();
    expect(state.ocr.history).toHaveLength(1);
  });

  test('Store dispatches actions correctly', () => {
    // Test that store can dispatch actions and update state
    expect(() => {
      store.dispatch(userSlice.setLoading(true));
      store.dispatch(medicationSlice.setLoading(true));
      store.dispatch(supplementSlice.setLoading(true));
      store.dispatch(interactionSlice.setLoading(true));
      store.dispatch(alertSlice.setLoading(true));
      store.dispatch(ocrSlice.setLoading(true));
    }).not.toThrow();

    // Check that loading states are updated
    const state = store.getState();
    expect(state.user.loading).toBe(true);
    expect(state.medications.loading).toBe(true);
    expect(state.supplements.loading).toBe(true);
    expect(state.interactions.loading).toBe(true);
    expect(state.alerts.loading).toBe(true);
    expect(state.ocr.loading).toBe(true);
  });

  test('Store handles error states correctly', () => {
    // Test setting errors
    store.dispatch(userSlice.setError('Test error'));
    store.dispatch(medicationSlice.setError('Medication error'));
    store.dispatch(supplementSlice.setError('Supplement error'));
    store.dispatch(interactionSlice.setError('Interaction error'));
    store.dispatch(alertSlice.setError('Alert error'));
    store.dispatch(ocrSlice.setError('OCR error'));

    const state = store.getState();
    expect(state.user.error).toBe('Test error');
    expect(state.medications.error).toBe('Medication error');
    expect(state.supplements.error).toBe('Supplement error');
    expect(state.interactions.error).toBe('Interaction error');
    expect(state.alerts.error).toBe('Alert error');
    expect(state.ocr.error).toBe('OCR error');
  });
});
