import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SignInScreen from './pages/signInScreen';
import SignUpScreen from './pages/signUpScreen';
import HomeScreen from './pages/homeScreen';
import ProductScreen from './pages/productScreen';
import ProfileScreen from './pages/profileScreen';
import WishlistScreen from './pages/wishlistScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
    
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs({ setIsAuthenticated }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Wishlist') {
            iconName = 'heart'; // Wishlist icon
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}



export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (token) setIsAuthenticated(true);
      } catch (err) {
        console.error('Error reading token:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isCheckingAuth) return null; // Optional: show a splash screen here

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="SignIn">
            {props => (
              <SignInScreen
                {...props}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {props => (
              <SignUpScreen
                {...props}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {props => (
              <ProfileScreen
                {...props}
                setIsAuthenticated={setIsAuthenticated}
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="MainTabs">
        {props => <MainTabs {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      
      )}
    </Stack.Navigator>
  );
}
