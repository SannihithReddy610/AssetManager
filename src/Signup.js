import React, { useState } from "react";
import { auth, firestoreDatabase } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(firestoreDatabase, "users", user.uid), {
        name,
        email,
        isAdmin: false, // Default to non-admin
      });

      setSuccess("Signup successful! You can now log in.");
      setError("");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <p style={{ fontSize: "0.8em", color: password.length < 6 ? "red" : "green" }}>
            Password must be at least 6 characters long.
          </p>
        </div>
        <button type="submit">Signup</button>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        {success && <p className="success-message" style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default Signup;
