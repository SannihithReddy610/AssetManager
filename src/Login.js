import React, { useState } from "react";
import { auth, firestoreDatabase } from "./firebase"; // Import Firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user document exists in Firestore
      const userDocRef = doc(firestoreDatabase, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists())
      {
        const userData = userDoc.data();
        if (userData.isApproved === false) 
        {
          alert("Account activation pending. Contact Admin")
        }
      }

      // Continue with your login flow (e.g., navigate to the home page)
      console.log("User logged in:", user.email);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "left", marginTop: "20px", marginBottom: "20px" }}>Welcome to Asset Manager</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
