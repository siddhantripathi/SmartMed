import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main screens
import HomeScreen from '../screens/main/HomeScreen';
import MedicationsScreen from '../screens/main/MedicationsScreen';
import SupplementsScreen from '../screens/main/SupplementsScreen';
import InteractionsScreen from '../screens/main/InteractionsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// OCR screens
import CameraScreen from '../screens/ocr/CameraScreen';
import OCRResultScreen from '../screens/ocr/OCRResultScreen';

// Report screens
import ReportsScreen from '../screens/reports/ReportsScreen';

// Types
import { RootStackParamList, MainTabParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Medications':
              iconName = 'local-pharmacy';
              break;
            case 'Supplements':
              iconName = 'fitness-center';
              break;
            case 'Interactions':
              iconName = 'warning';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Medications" component={MedicationsScreen} />
      <Tab.Screen name="Supplements" component={SupplementsScreen} />
      <Tab.Screen name="Interactions" component={InteractionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth stack navigator
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main app navigator
export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Check authentication status
    // This would typically check Firebase Auth state
    setIsAuthenticated(false); // For now, default to not authenticated
  }, []);

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        // Auth Stack
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              headerShown: true,
              title: 'Scan Medication',
            }}
          />
          <Stack.Screen
            name="OCRResult"
            component={OCRResultScreen}
            options={{
              headerShown: true,
              title: 'Scan Results',
            }}
          />
          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{
              headerShown: true,
              title: 'Reports',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
