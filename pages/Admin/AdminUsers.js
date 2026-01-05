import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAllUsers, deleteUser } from '../../services/user.service'; // Ensure deleteUser is imported
import { useNavigation } from '@react-navigation/native';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Define fetchUsers outside useEffect so we can call it after deleting
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
      Alert.alert("Error", "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id, name) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
               deleteUser(id);
              fetchUsers(); // Refresh the list
            } catch (err) {
              Alert.alert("Error", "Failed to delete user");
            }
          } 
        } 
      ]
    );
  };

  const renderUser = ({ item }) => (
    <View style={styles.productCard}>
      <View style={[styles.avatar, {backgroundColor: item.role === 'admin' ? '#6200ee' : '#ccc'}]}>
        <Text style={styles.avatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.userName}</Text>
        <Text style={styles.productDescription}>{item.userMail}</Text>
        <Text style={[styles.roleTag, {color: item.role === 'admin' ? '#6200ee' : '#666'}]}>
          {item.role ? item.role.toUpperCase() : 'USER'}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.icon} 
          onPress={() => navigation.navigate('AddEditUser', { user: item })}
        >
          <FontAwesome name="edit" size={22} color="#4B7BEC" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity 
          style={styles.icon} 
          onPress={() => handleDelete(item._id, item.userName)}
        >
          <FontAwesome name="trash" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.center} />
      ) : (
        <FlatList 
          data={users} 
          renderItem={renderUser} 
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          onRefresh={fetchUsers}
          refreshing={loading}
        />
      )}

      {/* Add User Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddEditUser')}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 16, paddingBottom: 80 }, // Added padding for FAB
    productCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    productDescription: { fontSize: 13, color: '#666', marginTop: 2 },
    actionButtons: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginLeft: 15, padding: 5 },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: '#6200ee',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#6200ee',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    roleTag: { fontSize: 10, fontWeight: 'bold', marginTop: 6 }
});