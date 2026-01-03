import React,{ useState, useEffect } from 'react';
import { View, Alert,Text, StyleSheet, TouchableOpacity,ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../services/user.service';
import { getUserData, removeUserData,removeToken } from '../services/user.service';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserData();
      console.log("data: ",data)
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }; 
  // Mock user data 
  

  const handleLogout = async () => {
    try {
      // 2. Sign out from Firebase first
      // This triggers onAuthStateChanged in AppNavigator, which sets 'user' to null
      await signOut(auth);
  
      // 3. Clear local storage and tokens
      await removeUserData();
      await removeToken(); // If this removes the JWT token
      
      // Note: You don't need navigation.navigate('SignIn') here. 
      // AppNavigator will automatically re-render and show the SignIn screen 
      // because the 'user' state becomes null.
    } catch (err) {
      console.log('Error logging out:', err);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUSer}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      
      <View style={styles.header}>
        <Text style={styles.username}>{user.userName}</Text>
        <Text style={styles.email}>{user.userMail}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={28} color="#4B7BEC" />
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
        </TouchableOpacity>
      </View>

      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#D0E6FF',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -25,
  },
  statCard: {
    backgroundColor: '#fff',
    width: 120,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7B7B7B',
    marginTop: 8,
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 50,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
