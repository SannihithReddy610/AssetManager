import React, { useState  } from "react";
import { QrReader } from "react-qr-reader"; // Corrected import

const SearchAsset = ({ fetchAssetDetails }) => {
  const [serialNumber, setSerialNumber] = useState("");
  const [error, setError] = useState("");
  const [scanStarted, setScanStarted] = useState(false);
  

  

  const handleScanResult = (result, error) => {
    if (result) {
      result = result.text;
      const parts = result.split('/');
      const assetSerialNo = parts[parts.length - 1].replace('.json', '');
      fetchAssetDetailsHandler(assetSerialNo);
      console.log("Scanned Result:", assetSerialNo);
      alert("QR Scan Succesfull. Asset Serial No. = " + assetSerialNo);
      //handleScanButtonClick();
    }

    if (error) {
      console.error("QR Scanner Error:", error);
    }
  };

  const fetchAssetDetailsHandler = (serial) => {
    if (!serial) {
      setError("Serial number cannot be empty!");
      return;
    }
    setError(""); // Clear errors
    setSerialNumber(serial);
    fetchAssetDetails(serial); // Fetch asset details
  };

  const handleScanButtonClick = () => {
    setScanStarted(!scanStarted); // Toggle scanner visibility
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <h3>Search Asset</h3>
      <input
        type="text"
        placeholder="Enter Serial Number"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "60%",
          margin: "10px",
        }}
      />
      <button
        onClick={() => fetchAssetDetailsHandler(serialNumber)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          margin: "10px",
        }}
      >
        Search
      </button>
      <p>OR</p>
      <button
        onClick={() => handleScanButtonClick()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          margin: "10px",
        }}
      >
        {scanStarted ? "Stop Scan" : "Scan QR Code To Fetch Asset Details" }
        
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {scanStarted && (
      <QrReader
        onResult={handleScanResult}
        constraints={{ facingMode: "environment" }}
        style={{ width: "80%", margin: "auto" }}
      />
    )}
      
    </div>
  );
};

export default SearchAsset;
