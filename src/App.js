import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import PasswordReset from "./PasswordReset";
import Logout from "./Logout";
import SearchAsset from "./SearchAsset"; // Import the SearchAsset component
import { auth, database } from "./firebase"; // Firebase instance
import { ref, get } from "firebase/database"; // Firebase database functions
import { onAuthStateChanged } from "firebase/auth";
import "./styles.css";

const App = () => {
  const [view, setView] = useState("login"); // Tracks current view (login/signup/reset)
  const [user, setUser] = useState(null); // Track logged-in user
  const [assetDetails, setAssetDetails] = useState(null); // Store fetched asset details
  const [error, setError] = useState(""); // Error handling
  const displayedKeys = ["SerialNo", "AssetNo", "AssetCategory", "AssetSubCategory", "CostCenter", "GA",
     "Asset_Description_1","Asset_Description_2","Asset_Description_3","CapDate","Quantity","BUn"];
  const [inputSerialNumber, setInputSerialNumber] = useState("");
  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Function to fetch asset details by serial number
  const fetchAssetDetails = async (serialNumber) => {
    if (!serialNumber) {
      setError("Serial number cannot be empty!");
      return;
    }

    setError(""); // Clear previous errors
    try {
      const assetRef = ref(database, `assets/${serialNumber}`);
      const snapshot = await get(assetRef);

      setInputSerialNumber(serialNumber);

      if (snapshot.exists()) {
        setAssetDetails(snapshot.val());
      } else {
        alert(`No asset found with Serial Number: ${serialNumber}`);
        setError(`No asset found with Serial Number: ${serialNumber}`);
        setAssetDetails(null);
      }
    } catch (err) {
      console.error("Error fetching asset details:", err);
      setError("Failed to fetch asset details. Please try again.");
    }
  };

  return (
    <div className="container" style={{ overflow: "auto", height: "100vh" }}>
      {user ? (
        <div style={{ position: "relative", padding: "20px" }}>
          {/* Logout Button on Top Right */}
          <div style={{ position: "absolute", top: "-25px", bottom: "25px", right: "-5px" }}>
            <Logout />
          </div>
  
          {/* Welcome Message on Top Left */}
          <h2 style={{ textAlign: "left", marginTop: "20px" }}>
            Welcome, {user.email}
          </h2>
  
          {/* Search Asset Component */}
          <SearchAsset fetchAssetDetails={fetchAssetDetails} />
  
          {/* Display Asset Details */}
          {assetDetails && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <h3>Asset details with serial number: {inputSerialNumber}</h3>
              <table style={{ margin: "0 auto", border: "1px solid black" }}>
                <tbody>
                  {Object.entries(assetDetails)
                    .filter(([key]) => displayedKeys.includes(key)) // Only display selected keys
                    .map(([key, value]) => (
                      <tr key={key}>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "left",
                          }}
                        >
                          <strong>{key}:</strong>
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "left",
                          }}
                        >
                          {value}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
  
          {/* Error Message */}
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        </div>
      ) : (
        <div>
          {/* Conditional rendering for Login, Signup, and Password Reset */}
          {view === "login" && <Login setView={setView} />}
          {view === "signup" && <Signup />}
          {view === "reset" && <PasswordReset setView={setView} />}
          {view !== "reset" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                className="toggle-button"
                onClick={() => setView(view === "login" ? "signup" : "login")}
              >
                {view === "login" ? "Go to Signup" : "Go to Login"}
              </button>
              {view === "login" && (
                <button
                  className="toggle-button"
                  onClick={() => setView("reset")}
                  style={{ marginLeft: "10px" }}
                >
                  Forgot Password?
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
