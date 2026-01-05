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
export async function addProduct(productData){
  try{
    console.log("productData: ", productData)
    await api.post('/api/addProduct',{productData})
  }catch(error){
    console.error('Error fetching products:', error);
    throw error;
  }

}
export async function updateProduct(id,productData){
  try{
    await api.post(`/api/updateProduct/${id}`,{productData})
  }catch(error){
    console.error('Error fetching products:', error);
    throw error;
  }

}
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
    console.log(error);
    console.error('Error fetching product:', error);
    throw error;
  }
};



export const deleteProduct = async (id) => {
  try {
    console.log("id in del: ",id);
    const response = await api.delete(`/api/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default { getProducts, getProductById,addProduct };  