// src/Logout.js
import React from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      //alert('Logout successful');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: '20px' }}>
      Logout
    </button>
  );
};

export default Logout;
