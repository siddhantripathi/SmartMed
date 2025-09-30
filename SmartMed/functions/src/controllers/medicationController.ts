import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Medication, Supplement } from '../types';

const db = admin.firestore();

/**
 * Validates medication data
 */
function validateMedicationData(data: any): boolean {
  return data &&
         typeof data.name === 'string' &&
         typeof data.dosage === 'string' &&
         typeof data.frequency === 'string' &&
         typeof data.isActive === 'boolean';
}

/**
 * Validates supplement data
 */
function validateSupplementData(data: any): boolean {
  return data &&
         typeof data.name === 'string' &&
         typeof data.dosage === 'string' &&
         typeof data.frequency === 'string' &&
         typeof data.category === 'string' &&
         typeof data.isActive === 'boolean';
}

/**
 * Add a medication for a user
 */
export const addMedication = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!validateMedicationData(data)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid medication data');
  }

  try {
    const medicationData: Medication = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('medications')
      .add(medicationData);

    functions.logger.info(`Medication added: ${docRef.id} for user ${context.auth.uid}`);
    return { id: docRef.id, ...medicationData };
  } catch (error) {
    functions.logger.error('Error adding medication:', error);
    throw new functions.https.HttpsError('internal', 'Failed to add medication');
  }
});

/**
 * Update a medication for a user
 */
export const updateMedication = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!data.id || !validateMedicationData(data)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid medication data or missing ID');
  }

  try {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    delete updateData.id; // Remove ID from update data

    await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('medications')
      .doc(data.id)
      .update(updateData);

    functions.logger.info(`Medication updated: ${data.id} for user ${context.auth.uid}`);
    return { id: data.id, ...updateData };
  } catch (error) {
    functions.logger.error('Error updating medication:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update medication');
  }
});

/**
 * Delete a medication for a user
 */
export const deleteMedication = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!data.id) {
    throw new functions.https.HttpsError('invalid-argument', 'Medication ID is required');
  }

  try {
    await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('medications')
      .doc(data.id)
      .delete();

    functions.logger.info(`Medication deleted: ${data.id} for user ${context.auth.uid}`);
    return { success: true };
  } catch (error) {
    functions.logger.error('Error deleting medication:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete medication');
  }
});

/**
 * Get all medications for a user
 */
export const getUserMedications = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const snapshot = await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('medications')
      .where('isActive', '==', true)
      .get();

    const medications: Medication[] = [];
    snapshot.forEach(doc => {
      medications.push({
        id: doc.id,
        ...doc.data()
      } as Medication);
    });

    return medications;
  } catch (error) {
    functions.logger.error('Error getting user medications:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get medications');
  }
});

/**
 * Add a supplement for a user
 */
export const addSupplement = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!validateSupplementData(data)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid supplement data');
  }

  try {
    const supplementData: Supplement = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('supplements')
      .add(supplementData);

    functions.logger.info(`Supplement added: ${docRef.id} for user ${context.auth.uid}`);
    return { id: docRef.id, ...supplementData };
  } catch (error) {
    functions.logger.error('Error adding supplement:', error);
    throw new functions.https.HttpsError('internal', 'Failed to add supplement');
  }
});

/**
 * Update a supplement for a user
 */
export const updateSupplement = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!data.id || !validateSupplementData(data)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid supplement data or missing ID');
  }

  try {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    delete updateData.id;

    await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('supplements')
      .doc(data.id)
      .update(updateData);

    functions.logger.info(`Supplement updated: ${data.id} for user ${context.auth.uid}`);
    return { id: data.id, ...updateData };
  } catch (error) {
    functions.logger.error('Error updating supplement:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update supplement');
  }
});

/**
 * Delete a supplement for a user
 */
export const deleteSupplement = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!data.id) {
    throw new functions.https.HttpsError('invalid-argument', 'Supplement ID is required');
  }

  try {
    await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('supplements')
      .doc(data.id)
      .delete();

    functions.logger.info(`Supplement deleted: ${data.id} for user ${context.auth.uid}`);
    return { success: true };
  } catch (error) {
    functions.logger.error('Error deleting supplement:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete supplement');
  }
});

/**
 * Get all supplements for a user
 */
export const getUserSupplements = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const snapshot = await db
      .collection('users')
      .doc(context.auth.uid)
      .collection('supplements')
      .where('isActive', '==', true)
      .get();

    const supplements: Supplement[] = [];
    snapshot.forEach(doc => {
      supplements.push({
        id: doc.id,
        ...doc.data()
      } as Supplement);
    });

    return supplements;
  } catch (error) {
    functions.logger.error('Error getting user supplements:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get supplements');
  }
});
