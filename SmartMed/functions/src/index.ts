import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Import controllers
import * as userController from './controllers/userController';
import * as medicationController from './controllers/medicationController';
import * as interactionController from './controllers/interactionController';
import * as ocrController from './controllers/ocrController';

// User management functions
export const createUserProfile = functions.auth.user().onCreate(userController.createUserProfile);
export const updateUserProfile = functions.firestore
  .document('users/{userId}')
  .onUpdate(userController.updateUserProfile);

// Medication management functions
export const addMedication = functions.https.onCall(medicationController.addMedication);
export const updateMedication = functions.https.onCall(medicationController.updateMedication);
export const deleteMedication = functions.https.onCall(medicationController.deleteMedication);
export const getUserMedications = functions.https.onCall(medicationController.getUserMedications);

// Supplement management functions (similar to medication functions)
export const addSupplement = functions.https.onCall(medicationController.addSupplement);
export const updateSupplement = functions.https.onCall(medicationController.updateSupplement);
export const deleteSupplement = functions.https.onCall(medicationController.deleteSupplement);
export const getUserSupplements = functions.https.onCall(medicationController.getUserSupplements);

// Interaction checking functions
export const checkInteractions = functions.https.onCall(interactionController.checkInteractions);
export const getInteractionDetails = functions.https.onCall(interactionController.getInteractionDetails);

// OCR processing functions
export const processMedicationImage = functions.storage
  .object()
  .onFinalize(ocrController.processMedicationImage);
export const extractMedicationInfo = functions.https.onCall(ocrController.extractMedicationInfo);

// Alert management functions
export const createInteractionAlert = functions.firestore
  .document('users/{userId}/medications/{medicationId}')
  .onCreate(interactionController.createInteractionAlert);

export const checkSupplementInteractions = functions.firestore
  .document('users/{userId}/supplements/{supplementId}')
  .onCreate(interactionController.checkSupplementInteractions);

// Scheduled functions for alerts
export const dailyInteractionCheck = functions.pubsub
  .schedule('0 0 * * *') // Daily at midnight
  .timeZone('America/New_York')
  .onRun(interactionController.dailyInteractionCheck);

// Export types for use in other files
export { User, Medication, Supplement, Interaction, Alert } from './types';
