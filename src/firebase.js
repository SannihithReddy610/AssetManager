// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVMXuv6HnFPjLnBsR-kqMTGhglEKTXPPo",
  authDomain: "assettmanagerr.firebaseapp.com",
  projectId: "assettmanagerr",
  storageBucket: "assettmanagerr.firebasestorage.app",
  messagingSenderId: "967087291861",
  appId: "1:967087291861:web:b3d6a28ea3123ab36c115c",
  measurementId: "G-J8LCRBLRPN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
