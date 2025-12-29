import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getWishlist } from "../services/user.service";
import Header from "../components/header"; // reuse your existing header
import { removeFromWishlist } from "../services/user.service";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; // optional icon

export default function WishlistScreen({ navigation }) {
  const [wishlist, setWishlist] = useState([]);
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredWishlist(wishlist);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredWishlist(
        wishlist.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            (item.desc && item.desc.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, wishlist]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWishlist();
      setWishlist(data.docs || []);
      setFilteredWishlist(data.docs || []);
    } catch (err) {
      console.log("Error loading wishlist:", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item.imgs && item.imgs.length > 0 ? (
        <Image source={{ uri: item.imgs[0] }} style={styles.productImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <FontAwesome name="image" size={40} color="#ccc" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price && item.price.$numberDecimal 
    ? item.price.$numberDecimal 
    : item.price || '0.00'}</Text>
      </View>
      {/* Remove button */}
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={async () => {
          try {
            await removeFromWishlist(item._id);
            setWishlist(prev => prev.filter(p => p._id !== item._id));
            setFilteredWishlist(prev => prev.filter(p => p._id !== item._id));
          } catch (err) {
            console.log('Error removing from wishlist:', err);
          }
        }}
      >
        <FontAwesome5 name="trash-alt" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWishlist}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredWishlist.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No products found in your wishlist</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={() => {}} // handled automatically by useEffect
      />
      <FlatList
        data={filteredWishlist}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id?.toString() || item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchWishlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: 15 },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  productImage: { width: 80, height: 80, borderRadius: 10 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: { flex: 1, marginLeft: 10 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { marginTop: 5, color: "#6200ee" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#888" },
  errorText: { fontSize: 16, color: "red", marginBottom: 10 },
  retryButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: { color: "#fff" },
});
