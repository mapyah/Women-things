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
    const userData = await getUserData(); // Get locally stored email

    const res = await api.post(`/api/wishlist/${productId}`,{ userMail: userData?.userMail });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function getWishlist() {
  try {
    const userData = await getUserData();
    console.log(userData?.userMail) // Get locally stored email
    const res = await api.post("/api/getWishlist",{ userMail: userData?.userMail }); // JWT is attached via interceptor
    return res.data; // Array of products  
  } catch (err) { 
    console.log("Error fetching wishlist:", err.response?.data  || err); 
    throw err.response?.data;  
  }   
}  
 
export async function getUser(userMail) {
  try {

    const res = await api.post("/api/getuser",{ userMail});
     // JWT is attached via interceptor
    const  UserData={
      userName: res.data.userName,
      userMail:res.data.userMail,
      role: res.data.role
     }
     await saveUserData(UserData);  
     console.log("role: ",UserData.role);
  } catch (err) { 
    console.log("Error fetching wishlist:", err.response?.data  || err); 
    throw err.response?.data; 
  }   
}  
export async function saveUserData(userData) {
  // userData = { userName: 'John', userMail: 'john@mail.com' }
  await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
}

// Retrieve User Data
export async function getUserData() {
  const data = await SecureStore.getItemAsync('user_data');
  return data ? JSON.parse(data) : null;
}

// Remove User Data (Clear on Logout)
export async function removeUserData() {
  await SecureStore.deleteItemAsync('user_data');
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
    await saveUserData({
      userName: res.data.userName,
      userMail: res.data.userMail,
      role: res.data.role
  });
    return res.data;
  } catch (err) {
    throw err.response?.data; 
  } 
}


export async function addToWishlist(productId) {
  try {
    const userData = await getUserData(); // Get locally stored email

    const res = await api.post(`/api/wishlist/${productId}`,{ userMail: userData?.userMail });
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
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/users'); // Ensure this matches your route
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export async function logout() {
  await removeToken();
}
export default { 
  signin,
  signup,
  logout,
  getWishlist,
  getUser,
  addToWishlist,
  removeFromWishlist,
  getAllUsers,
  deleteUser,
  getUserData,
  saveUserData
};