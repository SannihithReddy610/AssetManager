// src/App.js
import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import PasswordReset from "./PasswordReset"; // Import PasswordReset component
import Logout from "./Logout";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./styles.css";

const App = () => {
  const [view, setView] = useState("login"); // Tracks current view (login/signup/reset)
  const [user, setUser] = useState(null); // Track logged-in user

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <Logout />
        </div>
      ) : (
        <div>
          {/* Conditional rendering for Login, Signup, and Password Reset */}
          {view === "login" && <Login setView={setView} />}
          {view === "signup" && <Signup />}
          {view === "reset" && <PasswordReset setView={setView} />}
          {view !== "reset" && (
            <div className="button-container">
              <button
                className="toggle-button"
                onClick={() => setView(view === "login" ? "signup" : "login")}
              >
                {view === "login" ? "Create Account" : "Go to Login"}
              </button>
              {view === "login" && (
                <button
                  className="toggle-button"
                  onClick={() => setView("reset")}
                >
                  Forgot Password
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
