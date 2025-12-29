// services/products.service.js
import axios from 'axios';
import config from '../config/api';

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export function to get products
export const getProducts = async () => {
  try {
    console.log('Fetching from:', `${config.apiUrl}/api/products`);
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// You can add more product-related functions
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export default { getProducts, getProductById };