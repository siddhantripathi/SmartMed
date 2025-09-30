import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { User } from '../types';

const db = admin.firestore();

/**
 * Creates a user profile when a new user signs up
 */
export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  try {
    const userProfile: Partial<User> = {
      uid: user.uid,
      email: user.email || '',
      profile: {
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        allergies: [],
        medicalConditions: []
      },
      preferences: {
        notifications: true,
        alertFrequency: 'immediate'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('users').doc(user.uid).set(userProfile);

    functions.logger.info(`User profile created for ${user.uid}`);
    return userProfile;
  } catch (error) {
    functions.logger.error('Error creating user profile:', error);
    throw error;
  }
});

/**
 * Updates user profile when user document changes
 */
export const updateUserProfile = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    try {
      const newData = change.after.data();
      const previousData = change.before.data();

      // Update the updatedAt timestamp
      await change.after.ref.update({
        updatedAt: new Date()
      });

      functions.logger.info(`User profile updated for ${context.params.userId}`);
      return { newData, previousData };
    } catch (error) {
      functions.logger.error('Error updating user profile:', error);
      throw error;
    }
  });
