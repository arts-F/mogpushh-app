import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import {
  Home,
  Heart,
  MessageCircle,
  Users,
  User,
} from 'lucide-react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import PushScreen from './screens/PushScreen';
import FeedScreen from './screens/FeedScreen';
import RequestsScreen from './screens/RequestsScreen';
import ProfileScreen from './screens/ProfileScreen';

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
        fontSize: 11,
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
      name="Requests"
      component={RequestsStack}
      options={{ title: 'Requests' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
