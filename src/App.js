import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import PasswordReset from "./PasswordReset";
import Logout from "./Logout";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import SearchAsset from "./SearchAsset"; // Import the new component
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
        <div className="dashboard">
          <div className="header">
            <h2 className="welcome-message">Welcome, {user.email}</h2>
            <Logout />
          </div>
          <SearchAsset /> {/* Include the SearchAsset component */}
        </div>
      ) : (
        <div className="auth-section">
          {/* Conditional rendering for Login, Signup, and Password Reset */}
          {view === "login" && <Login setView={setView} />}
          {view === "signup" && <Signup />}
          {view === "reset" && <PasswordReset setView={setView} />}

          {/* Buttons for switching views */}
          {view !== "reset" && (
            <div className="button-group">
              <button
                className="toggle-button"
                onClick={() => setView(view === "login" ? "signup" : "login")}
              >
                {view === "login" ? "Signup" : "Go to Login"}
              </button>
              {view === "login" && (
                <button
                  className="toggle-button"
                  onClick={() => setView("reset")}
                >
                  Reset Password
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
