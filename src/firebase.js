import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZNk9vSnq9CCComKe76zcR8oRnw3rmIfc",
  authDomain: "assetmanagerwebapplication.firebaseapp.com",
  databaseURL: "https://assetmanagerwebapplication-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "assetmanagerwebapplication",
  storageBucket: "assetmanagerwebapplication.firebasestorage.app",
  messagingSenderId: "291874053153",
  appId: "1:291874053153:web:0b3a298bb33d7ed2ad5760",
  measurementId: "G-M1LRNG55C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app); // Export Firebase Storage
export const firestoreDatabase = getFirestore(app);
