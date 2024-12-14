import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVMXuv6HnFPjLnBsR-kqMTGhglEKTXPPo",
  authDomain: "assettmanagerr.firebaseapp.com",
  databaseURL: "https://assettmanagerr-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "assettmanagerr",
  storageBucket: "assettmanagerr.firebasestorage.app",
  messagingSenderId: "967087291861",
  appId: "1:967087291861:web:b3d6a28ea3123ab36c115c",
  measurementId: "G-J8LCRBLRPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app); // Export Firebase Storage
