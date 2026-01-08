
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// These would normally be in .env files.
// For the purpose of this demo, we assume the environment provides them.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mudichur-mart.firebaseapp.com",
  projectId: "mudichur-mart",
  storageBucket: "mudichur-mart.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
