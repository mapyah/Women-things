import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getProducts } from '../../services/product.service'; // Assuming these exist
// import { deleteProduct } from '../services/admin.service'; 

export default function AdminProducts({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.docs);
    } catch (err) {
      Alert.alert("Error", "Could not load products");
    } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => console.log("Delete product", id) }
    ]);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imgs?.[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price?.$numberDecimal || item.price}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => console.log("Edit", item._id)}>
          <FontAwesome name="pencil" size={20} color="#6200ee" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <FontAwesome name="trash" size={20} color="red" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" style={styles.center} /> : (
        <FlatList 
          data={products} 
          renderItem={renderProduct} 
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProduct')}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
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