// services/products.service.js
import axios from 'axios';
import config from '../config/apiUser';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export async function removeFromWishlist(productId) {
  try {
    const res = await api.delete(`/api/wishlist/${productId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function getWishlist() {
  try {
    const res = await api.get("/api/getWishlist"); // JWT is attached via interceptor
    return res.data; // Array of products  
  } catch (err) { 
    console.log("Error fetching wishlist:", err.response?.data  || err); 
    throw err.response?.data;  
  }   
}  
 
export async function getUser() {
  try {
    const res = await api.get("/api/getuser"); // JWT is attached via interceptor
    return res.data; // Array of products  
  } catch (err) { 
    console.log("Error fetching wishlist:", err.response?.data  || err); 
    throw err.response?.data;  
  }   
}  
// Store token securely
export async function saveToken(token) {
  await SecureStore.setItemAsync('jwt', token);
}

// Retrieve token
export async function getToken() {
  return await SecureStore.getItemAsync('jwt');
}

// Remove token
export async function removeToken() {
  await SecureStore.deleteItemAsync('jwt');
}

// Axios instance


// Automatically add token to requests
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export async function signup(userName, userMail, userPassword) {
  try {
    const res = await api.post('/api/signup', { userName, userMail, userPassword });
    return res.data;
  } catch (err) {
    throw err.response?.data; 
  } 
}


export async function addToWishlist(productId) {
  try {
    const res = await api.post(`/api/wishlist/${productId}`);
    return res.data; // contains updated wishlist
  } catch (err) {
    throw err.response?.data;
  }
}

// 🔑 SIGNIN 
export async function signin(userName, userPassword) {
  try {
    const res = await api.post('/api/signin', { userName, userPassword });

    if (res.data.token) {
      await saveToken(res.data.token);
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Signin failed' };
  }
}


export async function verifyToken() {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: 'No token stored' };

    const res = await api.post('/api/verify', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    return { success: false, message: 'Invalid or expired token' };
  }
}


export async function logout() {
  await removeToken();
}
