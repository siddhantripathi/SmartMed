import firestore from '@react-native-firebase/firestore';
import { Medication, Supplement, Alert } from '../store/slices';
import { store } from '../store';
import { setMedications, setSupplements, setAlerts } from '../store/slices';

export class FirestoreService {
  private unsubscribeMedications: (() => void) | null = null;
  private unsubscribeSupplements: (() => void) | null = null;
  private unsubscribeAlerts: (() => void) | null = null;

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    // This would typically come from Redux state or auth service
    // For now, return a placeholder
    return 'current-user-id';
  }

  /**
   * Set up real-time listeners for user's data
   */
  setupRealtimeListeners() {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    this.setupMedicationsListener(userId);
    this.setupSupplementsListener(userId);
    this.setupAlertsListener(userId);
  }

  /**
   * Set up medications listener
   */
  private setupMedicationsListener(userId: string) {
    if (this.unsubscribeMedications) {
      this.unsubscribeMedications();
    }

    this.unsubscribeMedications = firestore()
      .collection('users')
      .doc(userId)
      .collection('medications')
      .where('isActive', '==', true)
      .onSnapshot(
        (querySnapshot) => {
          const medications: Medication[] = [];
          querySnapshot.forEach((doc) => {
            medications.push({
              id: doc.id,
              ...doc.data(),
            } as Medication);
          });
          store.dispatch(setMedications(medications));
        },
        (error) => {
          console.error('Error listening to medications:', error);
        }
      );
  }

  /**
   * Set up supplements listener
   */
  private setupSupplementsListener(userId: string) {
    if (this.unsubscribeSupplements) {
      this.unsubscribeSupplements();
    }

    this.unsubscribeSupplements = firestore()
      .collection('users')
      .doc(userId)
      .collection('supplements')
      .where('isActive', '==', true)
      .onSnapshot(
        (querySnapshot) => {
          const supplements: Supplement[] = [];
          querySnapshot.forEach((doc) => {
            supplements.push({
              id: doc.id,
              ...doc.data(),
            } as Supplement);
          });
          store.dispatch(setSupplements(supplements));
        },
        (error) => {
          console.error('Error listening to supplements:', error);
        }
      );
  }

  /**
   * Set up alerts listener
   */
  private setupAlertsListener(userId: string) {
    if (this.unsubscribeAlerts) {
      this.unsubscribeAlerts();
    }

    this.unsubscribeAlerts = firestore()
      .collection('users')
      .doc(userId)
      .collection('alerts')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        (querySnapshot) => {
          const alerts: Alert[] = [];
          querySnapshot.forEach((doc) => {
            alerts.push({
              id: doc.id,
              ...doc.data(),
            } as Alert);
          });
          store.dispatch(setAlerts(alerts));
        },
        (error) => {
          console.error('Error listening to alerts:', error);
        }
      );
  }

  /**
   * Clean up all listeners
   */
  cleanup() {
    if (this.unsubscribeMedications) {
      this.unsubscribeMedications();
      this.unsubscribeMedications = null;
    }
    if (this.unsubscribeSupplements) {
      this.unsubscribeSupplements();
      this.unsubscribeSupplements = null;
    }
    if (this.unsubscribeAlerts) {
      this.unsubscribeAlerts();
      this.unsubscribeAlerts = null;
    }
  }

  /**
   * Add medication
   */
  async addMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const medicationData = {
        ...medication,
        createdAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      };

      const docRef = await firestore()
        .collection('users')
        .doc(userId)
        .collection('medications')
        .add(medicationData);

      return docRef.id;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  }

  /**
   * Update medication
   */
  async updateMedication(medicationId: string, updates: Partial<Medication>) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const updateData = {
        ...updates,
        updatedAt: firestore.Timestamp.now(),
      };

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('medications')
        .doc(medicationId)
        .update(updateData);
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  }

  /**
   * Delete medication
   */
  async deleteMedication(medicationId: string) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('medications')
        .doc(medicationId)
        .delete();
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  }

  /**
   * Add supplement
   */
  async addSupplement(supplement: Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const supplementData = {
        ...supplement,
        createdAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      };

      const docRef = await firestore()
        .collection('users')
        .doc(userId)
        .collection('supplements')
        .add(supplementData);

      return docRef.id;
    } catch (error) {
      console.error('Error adding supplement:', error);
      throw error;
    }
  }

  /**
   * Update supplement
   */
  async updateSupplement(supplementId: string, updates: Partial<Supplement>) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const updateData = {
        ...updates,
        updatedAt: firestore.Timestamp.now(),
      };

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('supplements')
        .doc(supplementId)
        .update(updateData);
    } catch (error) {
      console.error('Error updating supplement:', error);
      throw error;
    }
  }

  /**
   * Delete supplement
   */
  async deleteSupplement(supplementId: string) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('supplements')
        .doc(supplementId)
        .delete();
    } catch (error) {
      console.error('Error deleting supplement:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          profile: profileData,
          updatedAt: firestore.Timestamp.now(),
        });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(alertId: string) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('alerts')
        .doc(alertId)
        .update({
          isRead: true,
          readAt: firestore.Timestamp.now(),
        });
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId: string) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('alerts')
        .doc(alertId)
        .update({
          isAcknowledged: true,
          acknowledgedAt: firestore.Timestamp.now(),
        });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();
