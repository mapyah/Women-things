import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Image, StyleSheet, Alert, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addProduct } from '../../services/product.service'; // Adjust path
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AddProductScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [categorie, setCategorie] = useState('makeup'); // Default
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]); // Array of Base64 strings
  const [loading, setLoading] = useState(false);

  // Function to pick image and convert to Base64
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Keep quality low for Base64 storage
      base64: true, // 🔑 This is the critical part
    });

    if (!result.canceled) {
      // Create the Base64 data URI string
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImages([...images, base64Image]);
    }
  };

  const handleSave = async () => {
    if (!title || !price || !categorie) {
      Alert.alert('Error', 'Please fill in Title, Price, and Category');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title,
        desc,
        price: parseFloat(price),
        categorie,
        imgs: images // Sending the array of Base64 strings
      };

      await addProduct(productData);
      Alert.alert('Success', 'Product added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Product Images</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeBadge} 
              onPress={() => setImages(images.filter((_, i) => i !== index))}
            >
              <FontAwesome name="times-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <FontAwesome name="camera" size={30} color="#666" />
          <Text style={styles.addButtonText}>Add Image</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Matte Lipstick" />

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, { height: 100 }]} 
          value={desc} 
          onChangeText={setDesc} 
          multiline 
          placeholder="Product details..."
        />

        <Text style={styles.label}>Price ($)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="19.99" />

        
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {['makeup', 'skincare', 'haircare'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.catButton, categorie === cat && styles.catButtonActive]}
              onPress={() => setCategorie(cat)}
            >
              <Text style={[styles.catText, categorie === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Save Product</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  imageScroll: { marginBottom: 20 },
  imageContainer: { position: 'relative', marginRight: 15 },
  imagePreview: { width: 100, height: 100, borderRadius: 10 },
  removeBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 10 },
  addButton: { 
    width: 100, height: 100, borderRadius: 10, borderStyle: 'dashed', 
    borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' 
  },
  addButtonText: { fontSize: 12, color: '#666', marginTop: 5 },
  input: { 
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, 
    fontSize: 16, marginBottom: 15, backgroundColor: '#f9f9f9' 
  },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  catButton: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, width: '30%', alignItems: 'center' },
  catButtonActive: { backgroundColor: '#6200ee', borderColor: '#6200ee' },
  catText: { textTransform: 'capitalize', color: '#666' },
  catTextActive: { color: '#fff', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#6200ee', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});