import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import * as SecureStore from "expo-secure-store";

const firebaseConfig = {
  apiKey: "AIzaSyD2QadOEIFewL60vh8-0bZuJBwqdWDVyBM",
  authDomain: "women-things-78c8f.firebaseapp.com",
  projectId: "women-things-78c8f",
  storageBucket: "women-things-78c8f.firebasestorage.app",
  messagingSenderId: "225997171050",
  appId: "1:225997171050:web:f1ceedfb17dc1ab1bcdd13",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(SecureStore),
});


