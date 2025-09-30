import React, { useEffect } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Redux store
import { store, persistor } from './store';

// Navigation
import { AppNavigator } from './navigation/AppNavigator';

// Services
import { initializeFirebase } from './services/firebase';
import { setupNotifications } from './services/notifications';

// Utils
import { colors } from './utils/colors';
import { LoadingScreen } from './components/LoadingScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = React.useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Firebase
        await initializeFirebase();
        setIsFirebaseReady(true);

        // Setup notifications
        await setupNotifications();

        // Additional initialization can go here
        console.log('SmartMed app initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
