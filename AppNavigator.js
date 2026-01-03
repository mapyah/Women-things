import { getUserData } from './services/user.service'; // Adjust path
import AdminScreen from './pages/Admin/AdminScreen';
import AdminProducts from './pages//Admin/AdminProducts';
import AdminUsers from './pages/Admin/AdminUsers';
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; 
 
// Screens 
import HomeScreen from './pages/homeScreen';
import ProductScreen from './pages/productScreen';
import SignInScreen from './pages/signInScreen';
import SignUpScreen from './pages/signUpScreen';
import ProfileScreen from './pages/profileScreen';
import WishlistScreen from './pages/wishlistScreen';
import AddProductScreen from './pages/Admin/AddProduct'
import AddEditUserScreen from'./pages/Admin/AddEditUser'
// Navigators Initialization
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AdminStack = createNativeStackNavigator();

// 1. Create a Home Stack so the Detail screen is part of the Home Tab
function HomeStack() {
  return (
    <Stack.Navigator>
    
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
     
      
    </Stack.Navigator>
  );
}
function AdminStackScreen() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AdminMain" component={AdminScreen} options={{ title: 'Admin' }} />
      <AdminStack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Products Management' }} />
      <AdminStack.Screen name="AddEditUser" component={AddEditUserScreen} options={{ title: 'User Details' }} 
/>
      <AdminStack.Screen name="AdminProducts" component={AdminProducts} options={{ title: 'Products Management' }} />
      <AdminStack.Screen name="AdminUsers" component={AdminUsers} options={{ title: 'User Management' }} />
    </AdminStack.Navigator>
  );
}
function MainTabs({ userRole }) { // Pass role as a prop
  const isAdmin = userRole === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Wishlist') iconName = 'heart';
          else if (route.name === 'Profile') iconName = 'user';
          else if (route.name === 'Admin') iconName = 'dashboard'; // Admin icon
          
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />

            <Tab.Screen name="Wishlist" component={WishlistScreen} />
      
      {isAdmin && (
  <Tab.Screen name="Admin" component={AdminStackScreen} />
)}

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const data = await getUserData(); 
        console.log("data in navg: ",data)
        setRole(data?.role);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setRole(null);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, [initializing]);

  if (initializing) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
       <>
       <Stack.Screen name="MainTabs">
         {props => <MainTabs {...props} userRole={role} />}
       </Stack.Screen>

       <Stack.Screen 
         name="ProductDetail" 
         component={ProductScreen} 
         options={{ headerShown: false }} 
       />
     </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}