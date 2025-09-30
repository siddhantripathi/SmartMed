import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../store/slices/userSlice';
import { store } from '../store';
import { setUser, setLoading, setError, logout as logoutAction } from '../store/slices/userSlice';

export class AuthService {
  private unsubscribeAuth: (() => void) | null = null;

  /**
   * Initialize authentication listener
   */
  initializeAuthListener() {
    this.unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        await this.handleUserSignedIn(user);
      } else {
        // User is signed out
        store.dispatch(logoutAction());
      }
    });
  }

  /**
   * Clean up authentication listener
   */
  cleanup() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
  }

  /**
   * Handle user signed in
   */
  private async handleUserSignedIn(firebaseUser: any) {
    try {
      store.dispatch(setLoading(true));

      // Get user profile from Firestore
      const userDoc = await firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .get();

      let userProfile = null;
      if (userDoc.exists) {
        userProfile = userDoc.data();
      }

      const user: Partial<User> = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        profile: userProfile?.profile || {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          allergies: [],
          medicalConditions: []
        },
        preferences: userProfile?.preferences || {
          notifications: true,
          alertFrequency: 'immediate'
        },
        isAuthenticated: true,
      };

      store.dispatch(setUser(user));
    } catch (error) {
      console.error('Error handling user signed in:', error);
      store.dispatch(setError('Failed to load user data'));
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string) {
    try {
      store.dispatch(setLoading(true));
      await auth().signInWithEmailAndPassword(email, password);
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
      store.dispatch(setError(error.message));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string) {
    try {
      store.dispatch(setLoading(true));
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      // User profile will be created by the Firebase function
      return userCredential.user;
    } catch (error: any) {
      store.dispatch(setError(error.message));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      await auth().signOut();
      // State will be cleared by onAuthStateChanged
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth().currentUser;
  }
}

// Export singleton instance
export const authService = new AuthService();
