import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const setupNotifications = async () => {
  try {
    // Request permission for notifications
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');

      // Get FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Handle background messages
      messaging().onMessage(async remoteMessage => {
        console.log('Foreground message received:', remoteMessage);
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message received:', remoteMessage);
      });

      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error setting up notifications:', error);
    throw error;
  }
};

export const getFCMToken = async () => {
  try {
    return await messaging().getToken();
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const onTokenRefresh = (callback: (token: string) => void) => {
  return messaging().onTokenRefresh(callback);
};
