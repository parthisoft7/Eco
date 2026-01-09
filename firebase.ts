import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase configuration for Mudichur Mart.
 * Exact credentials provided by the user for project 'eccommercerazorpay'.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAfX15clZrCSLE4xp_Up1aVxni8L5pC4K8",
  authDomain: "eccommercerazorpay.firebaseapp.com",
  projectId: "eccommercerazorpay",
  storageBucket: "eccommercerazorpay.firebasestorage.app",
  messagingSenderId: "258455309946",
  appId: "1:258455309946:web:34a365390556518b9f75c3",
  measurementId: "G-4SGREDLQN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize core services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
