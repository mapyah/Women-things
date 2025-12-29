// components/header.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text,
  TouchableOpacity,
  Keyboard,
  Animated
} from 'react-native';

export default function Header({ searchQuery, setSearchQuery, onSearch }) {
  const [focused, setFocused] = useState(false);
  const scaleValue = new Animated.Value(1);

  const handleSearch = () => {
    // Add subtle animation when searching
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSearch(searchQuery.trim());
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(scaleValue, {
      toValue: 1.02,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Find amazing content</Text>
      
      <Animated.View 
        style={[
          styles.searchContainer,
          focused && styles.searchContainerFocused,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search for anything..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity 
          style={[
            styles.searchButton,
            searchQuery && styles.searchButtonActive
          ]} 
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#4B5563',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainerFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    height: 52,
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System', // Use system font for better readability
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    transition: 'all 0.2s ease-in-out',
  },
  searchButtonActive: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
});