import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { addToWishlist } from '../services/user.service';


const { width } = Dimensions.get('window');

export default function ProductScreen({ route, navigation }) {
  const [quantity, setQuantity] = useState(1); 
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { product } = route.params;
  const handleAddToWishlist = async () => {
    try {
      const data = await addToWishlist(product._id);
      console.log("Wishlist:", data.wishlist);
      setIsWishlisted(true);
      alert("Added to wishlist!");
    } catch (err) {
      console.log("Wishlist error:", err);
    }
  };
  const handleContactSales = () => {
    const phoneNumber = '212776728745'; 
    const total = (product.price * quantity).toFixed(2);
    const message = `Hello, I want to purchase ${quantity} of ${product.title}(s) `;
  
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('WhatsApp not installed', 'Please install WhatsApp to contact sales.');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };
  
  

  if (!product || product.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome name="inbox" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No product found</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  {/* Back Button */}
  <TouchableOpacity 
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <FontAwesome name="arrow-left" size={20} color="#333" />
  </TouchableOpacity>

  {/* Wishlist Heart Button */}
  <TouchableOpacity 
    style={styles.wishlistButton}
    onPress={handleAddToWishlist}
  >
    <FontAwesome
      name={isWishlisted ? "heart" : "heart-o"}
      size={26}
      color={isWishlisted ? "#e63946" : "#333"}
    />
  </TouchableOpacity>
</View>


      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        {/* Product Images Slider */}
<View style={styles.imageContainer}>
  {product.imgs && product.imgs.length > 0 ? (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      {product.imgs.map((img, index) => (
        <View key={index} style={{ width, height: 350 }}>
          <Image
            source={{ uri: img }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  ) : (
    <View style={styles.imagePlaceholder}>
      <FontAwesome name="image" size={80} color="#ccc" />
    </View>
  )}
</View>



        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Product Name */}
          <Text style={styles.productName}>{product.title}</Text>

          

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.productPrice}>${product.price && product.price.$numberDecimal 
    ? product.price.$numberDecimal 
    : product.price || '0.00'}</Text>
            <View style={styles.stockBadge}>
              <FontAwesome name="check-circle" size={14} color="#2ecc71" />
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          </View>

          {/* Description */}
          {product.desc && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.productDescription}>
                {product.desc}
              </Text>
            </View>
          )}

         

         
        </View>
      </ScrollView>

      {/* Bottom Buy Button */}
      {/* Bottom Bar with Quantity Selector and Contact Sales */}
<View style={styles.bottomBar}>
  <View style={styles.bottomContent}>
    {/* Quantity Selector */}
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
      >
        <Text style={styles.quantityOperator}>−</Text>
      </TouchableOpacity>

      <View style={styles.quantityDisplay}>
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>

      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => setQuantity(prev => prev + 1)}
      >
        <Text style={styles.quantityOperator}>+</Text>
      </TouchableOpacity>
    </View>

    {/* Contact Sales Button */}
    <TouchableOpacity
      style={styles.buyButton}
      onPress={handleContactSales}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <FontAwesome name="shopping-bag" size={22} color="white" />
        <Text style={styles.buyButtonText}>Contact Sales</Text>
      </View>
    </TouchableOpacity>
  </View>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:35
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  wishlistButton: {
    marginRight: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  
  
  imageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 32,
  },
  
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  stockText: {
    color: '#2ecc71',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  
  
 
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 40
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityOperator: {
    fontSize: 22,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  quantityDisplay: {
    minWidth: 50,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  buyButton: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#6200ee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});