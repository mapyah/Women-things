import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { getAllUsers } from '../services/admin.service'; 

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch - Replace with your actual service call
    const fetchUsers = async () => {
      setLoading(false);
      const data = await getProducts();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <View style={styles.productCard}>
      <View style={[styles.avatar, {backgroundColor: item.role === 'admin' ? '#6200ee' : '#ccc'}]}>
        <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.userName}</Text>
        <Text style={styles.productDescription}>{item.userMail}</Text>
        <Text style={[styles.roleTag, {color: item.role === 'admin' ? '#6200ee' : '#666'}]}>
          {item.role.toUpperCase()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert("Management", "Manage user permissions?")}>
        <FontAwesome name="cog" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" style={styles.center} /> : (
        <FlatList 
          data={users} 
          renderItem={renderUser} 
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 16 },
    productCard: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 3,
    },
    productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold' },
    productPrice: { color: '#2ecc71', fontWeight: '600' },
    productDescription: { fontSize: 12, color: '#666' },
    actionButtons: { flexDirection: 'row' },
    icon: { marginLeft: 15 },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: '#6200ee',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    roleTag: { fontSize: 10, fontWeight: 'bold', marginTop: 4 }
  });