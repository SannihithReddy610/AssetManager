import React, { useState } from "react";
import { database } from "./firebase";
import { ref, get } from "firebase/database";

const SearchAsset = () => {
  const [serialNo, setSerialNo] = useState("");
  const [assetDetails, setAssetDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchAssetDetails = async () => {
    if (!serialNo.trim()) {
      setError("Please enter a valid Serial Number.");
      return;
    }
    setError(null);
    setAssetDetails(null);

    try {
      const assetRef = ref(database, `assets/${serialNo}`);
      const snapshot = await get(assetRef);

      if (snapshot.exists()) {
        setAssetDetails(snapshot.val());
      } else {
        setError("No asset found with the given Serial Number.");
      }
    } catch (err) {
      setError("An error occurred while fetching asset details.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Search Asset by Serial Number</h2>
      <input
        type="text"
        value={serialNo}
        onChange={(e) => setSerialNo(e.target.value)}
        placeholder="Enter Serial Number"
      />
      <button onClick={fetchAssetDetails} className="search-button">Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {assetDetails && (
  <div>
    <h3>Asset Details:</h3>
    <table
      border="1"
      style={{
        borderCollapse: "collapse",
        width: "100%",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr>
          <th style={{ width: "30%", textAlign: "left", padding: "8px" }}>
            Field
          </th>
          <th style={{ width: "70%", textAlign: "left", padding: "8px" }}>
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "8px" }}>Asset Number</td>
          <td style={{ padding: "8px" }}>{assetDetails.AssetNo}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Asset Category</td>
          <td style={{ padding: "8px" }}>{assetDetails.AssetCategory}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Asset Sub-Category</td>
          <td style={{ padding: "8px" }}>{assetDetails.AssetSubCategory}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Cost Center</td>
          <td style={{ padding: "8px" }}>{assetDetails.CostCenter}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>GA</td>
          <td style={{ padding: "8px" }}>{assetDetails.GA}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Asset Description 1</td>
          <td style={{ padding: "8px" }}>{assetDetails.AssetDescription1}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Asset Description 2</td>
          <td style={{ padding: "8px" }}>{assetDetails.AssetDescription2}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Asset Description 3</td>
          <td style={{ padding: "8px" }}>{assetDetails.AssetDescription3}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px" }}>Cap. Date</td>
          <td style={{ padding: "8px" }}>{assetDetails.CapDate}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default SearchAsset;
