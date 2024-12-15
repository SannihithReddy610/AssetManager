import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import PasswordReset from "./PasswordReset";
import Logout from "./Logout";
import SearchAsset from "./SearchAsset"; // Import the SearchAsset component
import AdminPanel from "./AdminPanel"; // Import AdminPanel
import { doc, getDoc } from "firebase/firestore";
import { auth, database, storage, firestoreDatabase } from "./firebase"; // Firebase instance
import { ref, get, set } from "firebase/database"; // Firebase database functions
import { onAuthStateChanged } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage functions
import "./styles.css";

const App = () => {
  const [view, setView] = useState("login"); // Tracks current view (login/signup/reset)
  const [user, setUser] = useState(null); // Track logged-in user
  const [assetDetails, setAssetDetails] = useState(null); // Store fetched asset details
  const [error, setError] = useState(""); // Error handling
  const displayedKeys = ["SerialNo", "SAP_Code", "AssetCategory", "CostCenterNew", "GA",
    "AssetDescription_1", "AssetDescription_2", "AssetDescription_3", "CapDate", "Quantity", "Unit"];
  const [inputSerialNumber, setInputSerialNumber] = useState("");
  const [showUpdateOptions, setShowUpdateOptions] = useState(false); // Initially set to false
  const [imageFile, setImageFile] = useState(null);
  const [currentLocation, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Store the image URL
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const [showUserManagement, setShowUserManagement] = useState(false); // State to control User Management visibility


  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAssetDetails(null);
      if (currentUser) {
        try {
          const userDocRef = doc(firestoreDatabase, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef); 
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.isApproved === false) {
              setUser(null); // Log out the user if account is pending
            } else if (userData.isApproved === true) {
              setIsAdmin(userData.isAdmin || false);
            } else {
              setUser(null);
            }
          } else {
            setError("User document not found.");
            setUser(null);
          }
        } catch (err) {
          console.error("Error checking user status:", err);
          setError("Error checking user status.");
          setUser(null);
        }
      } else {
        setIsAdmin(false);
      }
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
      const assetRef = ref(database, `${serialNumber}`);
      const snapshot = await get(assetRef);

      setInputSerialNumber(serialNumber);

      if (snapshot.exists()) {
        const fetchedData = snapshot.val();
        setAssetDetails(fetchedData);
        setImageUrl(fetchedData.imageUrl || ""); // Set the image URL if it exists
        if (fetchedData.imageUrl && fetchedData.imageUrl.trim() !== "") {
          alert(`Asset already verified`);
        }
        setLocation(fetchedData.currentLocation || ""); // Set the location if it exists
        setRemarks(fetchedData.remarks || ""); // Set the remarks if they exist
        setShowUpdateOptions(false); // Hide update options on new asset search
      } else {
        alert(`No asset found with Serial Number: ${serialNumber}`);
        setError(`No asset found with Serial Number: ${serialNumber}`);
        setAssetDetails(null);
        setShowUpdateOptions(false); // Hide update options if no asset is found
      }
    } catch (err) {
      console.error("Error fetching asset details:", err);
      setError("Failed to fetch asset details. Please try again.");
      setShowUpdateOptions(false); // Hide update options on error
    }
  };

  // Function to toggle User Management visibility
  const toggleUserManagement = () => {
    setShowUserManagement(!showUserManagement);
    if (showUserManagement) {
      setAssetDetails(null); // Hide asset details when showing user management
    }
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }

    setIsUploading(true); // Set uploading state to true
    const imageRef = storageRef(storage, `images/${imageFile.name}`);
    try {
      const uploadResult = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Set the image URL to state
      setImageUrl(downloadURL);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false); // Set uploading state to false after upload completes
    }
  };

  // Function to get the current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to update asset details
  const updateAssetDetails = async () => {
    if (!remarks) {
      alert("Please add remarks before saving.");
      return;
    }

    const updatedAsset = {
      ...assetDetails,
      imageUrl: imageUrl || assetDetails.imageUrl, // Ensure imageUrl is defined before updating
      currentLocation,
      remarks
    };

    // Update the asset details in Firebase
    const assetRef = ref(database, `${inputSerialNumber}`);
    try {
      await set(assetRef, updatedAsset);
      alert("Asset details updated successfully!");
      setShowUpdateOptions(false); // Hide update options after saving
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset details.");
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
            Welcome, {user.email} {isAdmin && "(Admin)"}
          </h2>

          {/* Search Asset Component */}
          <SearchAsset fetchAssetDetails={fetchAssetDetails} />
          
          {/* Admin Panel with User Management Toggle */}
          {isAdmin && (
            <>
            <h3 style={{ textAlign: "left", marginTop: "20px" }}>Admin Panel</h3> 
              <button onClick={toggleUserManagement} style={{ marginTop: "20px" }}>
                {showUserManagement ? "Hide User Management" : "Show User Management"}
              </button>
            </>
          )}

          {/* Show User Management if toggled */}
          {isAdmin && showUserManagement && <AdminPanel />}

          {/* Display Asset Details */}
          {assetDetails && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <meta name="viewport" content="width=device-width, initial-scale=0.75"></meta>
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
              {/* Button to show update options */}
              <button onClick={() => setShowUpdateOptions(true)} style={{ marginTop: "20px" }}>
                Update Asset Details
              </button>
            </div>
          )}

          {/* Show Update Options */}
          {assetDetails && showUpdateOptions && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "20px" }}>
              {/* Image Upload */}
              <div style={{ marginBottom: "0px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  id="imageUpload"
                  style={{ display: "block" }}
                />
                <button onClick={handleImageUpload} style={{ marginTop: "10px" }}>
                  {isUploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>

              {/* Show Uploaded Image */}
              {imageUrl && (
                <div style={{ marginTop: "0px" }}>
                  <h4>Existing Image:</h4>
                  <img src={imageUrl} alt="Uploaded" style={{ width: "100%", maxWidth: "300px", marginBottom: "10px" }} />
                </div>
              )}

              {/* Current Location */}
              <div style={{ marginBottom: "10px" }}>
                <button onClick={getCurrentLocation} style={{ marginTop: "10px" }}>Get Current Location</button>
                {currentLocation && <p style={{ marginTop: "5px" }}>{"Current location: " + currentLocation}</p>}
              </div>

              {/* Remarks */}
              <div style={{ marginBottom: "10px" }}>
                <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>Remarks</h4>
                <textarea
                  id="remarks"
                  placeholder="Enter remarks here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "16px"
                  }}
                />
                <button onClick={updateAssetDetails} style={{ marginTop: "10px" }}>Save</button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        </div>
      ) : (
        <div>
          {/* Conditional rendering for Login, Signup, and Password Reset */}
          {view === "login" && <Login />}
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
