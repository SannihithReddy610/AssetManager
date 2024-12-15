import React, { useEffect, useState } from "react";
import { firestoreDatabase } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestoreDatabase, "users");
        const snapshot = await getDocs(usersCollection);
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle Admin Status
  const toggleAdminStatus = async (userId, isAdmin) => {
    try {
      const userDoc = doc(firestoreDatabase, "users", userId);
      await updateDoc(userDoc, { isAdmin: !isAdmin });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin: !isAdmin } : user
        )
      );
      alert(`Admin status updated for user ID: ${userId}`);
    } catch (err) {
      console.error("Error updating admin status:", err);
      alert("Failed to update admin status.");
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <table border="1" style={{ width: "100%", textAlign: "left", marginTop:"20px" }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Admin Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                  <td>
                    <button
                      onClick={() =>
                        toggleAdminStatus(user.id, user.isAdmin)
                      }
                    >
                      {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
