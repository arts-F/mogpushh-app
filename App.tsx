import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import {
  Home,
  Heart,
  MessageCircle,
  Users,
  User,
  Clock,
  Cloud,
} from 'lucide-react-native';

// Context
import { AppProvider, useApp } from './context/AppContext';

// Screens
import HomeScreen from './screens/HomeScreen';
import PushScreen from './screens/PushScreen';
import FeedScreen from './screens/FeedScreen';
import RequestsScreen from './screens/RequestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import TimeZoneClockScreen from './screens/TimeZoneClockScreen';
import WeatherDashboardScreen from './screens/WeatherDashboardScreen';

// Theme colors
export const theme = {
  primary: '#001a4d', // Deep navy blue
  secondary: '#FFD700', // Gold
  background: '#f8f9fa',
  text: '#001a4d',
  lightText: '#666666',
  white: '#ffffff',
  error: '#ef4444',
  success: '#10b981',
  border: '#e5e7eb',
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ title: 'MOGPUSHH' }}
    />
  </Stack.Navigator>
);

const PushStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="PushMain"
      component={PushScreen}
      options={{ title: 'PUSH - Pray Until Something Happens' }}
    />
  </Stack.Navigator>
);

const FeedStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="FeedMain"
      component={FeedScreen}
      options={{ title: 'Prophetic Feed' }}
    />
  </Stack.Navigator>
);

const RequestsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="RequestsMain"
      component={RequestsScreen}
      options={{ title: 'Prayer Requests' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
  </Stack.Navigator>
);

const TimeZoneStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="TimeZoneMain"
      component={TimeZoneClockScreen}
      options={{ title: 'Global Clock' }}
    />
  </Stack.Navigator>
);

const WeatherStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: theme.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.background },
    }}
  >
    <Stack.Screen
      name="WeatherMain"
      component={WeatherDashboardScreen}
      options={{ title: 'Weather Dashboard' }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.white,
        borderTopColor: theme.border,
        borderTopWidth: 1,
        paddingBottom: 5,
        paddingTop: 8,
        height: 60,
      },
      tabBarActiveTintColor: theme.secondary,
      tabBarInactiveTintColor: theme.lightText,
      tabBarLabelStyle: {
        fontSize: 9,
        fontWeight: '600',
        marginTop: 4,
      },
      tabBarIcon: ({ color, size }) => {
        let icon;

        switch (route.name) {
          case 'Home':
            icon = <Home size={size} color={color} />;
            break;
          case 'Push':
            icon = <Heart size={size} color={color} />;
            break;
          case 'Feed':
            icon = <MessageCircle size={size} color={color} />;
            break;
          case 'Requests':
            icon = <Users size={size} color={color} />;
            break;
          case 'TimeZone':
            icon = <Clock size={size} color={color} />;
            break;
          case 'Weather':
            icon = <Cloud size={size} color={color} />;
            break;
          case 'Profile':
            icon = <User size={size} color={color} />;
            break;
          default:
            icon = <Home size={size} color={color} />;
        }

        return icon;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name="Push"
      component={PushStack}
      options={{ title: 'PUSH' }}
    />
    <Tab.Screen
      name="Feed"
      component={FeedStack}
      options={{ title: 'Feed' }}
    />
    <Tab.Screen
      name="TimeZone"
      component={TimeZoneStack}
      options={{ title: 'Clock' }}
    />
    <Tab.Screen
      name="Weather"
      component={WeatherStack}
      options={{ title: 'Weather' }}
    />
    <Tab.Screen
      name="Requests"
      component={RequestsStack}
      options={{ title: 'Prayer' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

function RootNavigator() {
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
