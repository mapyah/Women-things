import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AdminScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage your application data</Text>
      </View>

      <View style={styles.menuGrid}>
        {/* Manage Products Card */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminProducts')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
            <FontAwesome name="shopping-basket" size={30} color="#1e88e5" />
          </View>
          <Text style={styles.cardText}>Manage Products</Text>
        </TouchableOpacity>

        {/* Manage Users Card */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminUsers')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#f3e5f5' }]}>
            <FontAwesome name="users" size={30} color="#8e24aa" />
          </View>
          <Text style={styles.cardText}>Manage Users</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  menuGrid: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '47%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
});