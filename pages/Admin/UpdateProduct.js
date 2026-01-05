import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, StyleSheet, Alert, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateProduct } from '../../services/product.service'; // Adjust path
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function EditProductScreen({ route, navigation }) {
  // Get the existing product data from navigation params
  const { product } = route.params;

  const [title, setTitle] = useState(product.title || '');
  const [desc, setDesc] = useState(product.desc || '');
  const [price, setPrice] = useState(
    product.price?.$numberDecimal ? product.price.$numberDecimal.toString() : product.price?.toString() || ''
  );
  const [categorie, setCategorie] = useState(product.categorie || 'makeup');
  const [images, setImages] = useState(product.imgs || []);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Compressed for Base64 storage
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImages([...images, base64Image]);
    }
  };

  const handleUpdate = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Title and Price are required');
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        title,
        desc,
        price: parseFloat(price),
        categorie,
        imgs: images
      };

      await updateProduct(product._id, updatedData);
      
      Alert.alert('Updated', 'Product updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Product Images ({images.length})</Text>
      <ScrollView horizontal style={styles.imageScroll}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => setImages(images.filter((_, i) => i !== index))}
            >
              <FontAwesome name="minus-circle" size={22} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <FontAwesome name="plus" size={24} color="#6200ee" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Price ($)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

        <Text style={styles.label}>Category</Text>
        <View style={styles.catRow}>
          {['makeup', 'skincare', 'haircare'].map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setCategorie(cat)}
              style={[styles.catChip, categorie === cat && styles.catChipActive]}
            >
              <Text style={[styles.catText, categorie === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={desc} 
          onChangeText={setDesc} 
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Update Product</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  imageScroll: { flexDirection: 'row', marginBottom: 10 },
  imageWrapper: { marginRight: 10, position: 'relative' },
  imagePreview: { width: 80, height: 80, borderRadius: 8 },
  deleteBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 10 },
  addImageBtn: { width: 80, height: 80, borderStyle: 'dashed', borderWidth: 1, borderColor: '#6200ee', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12, backgroundColor: '#fafafa' },
  textArea: { height: 100, textAlignVertical: 'top' },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  catChip: { padding: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 20, width: '30%', alignItems: 'center' },
  catChipActive: { backgroundColor: '#6200ee', borderColor: '#6200ee' },
  catText: { color: '#666', textTransform: 'capitalize' },
  catTextActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#6200ee', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});