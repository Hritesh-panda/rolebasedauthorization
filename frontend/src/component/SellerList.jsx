import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get("http://localhost:3032/sellers");
        setSellers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch managers");
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        {error}
      </div>
    );
  // handle delete the seller

  const handleDelete = async (id) => {
    // Optional: Add a confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this seller?"
    );
    if (!confirmDelete) return;

    // Set loading state
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3032/deleteseller/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete seller");
      }

      // Successfully deleted
      setSellers((prev) => prev.filter((seller) => seller.id !== id));

      // Optional: Show success notification
      toast.success("seller deleted successfully");
    } catch (err) {
      setError(err.message);
      // Optional: Show error notification
      toast.error(err.message);
    } finally {
      // Clear loading state
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <button className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded">
        <Link to="/dashboard" className="text-black text-decoration-none">
          Back
        </Link>
      </button>
      <h1 className="text-3xl font-bold text-center mb-6">Sellers List</h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((sellers) => (
              <tr
                key={sellers.id}
                className="bg-white border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {sellers.id}
                </td>
                <td className="px-6 py-4">{sellers.username}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    {sellers.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 transition duration-300 ease-in-out transform hover:scale-110"
                      onClick={() =>
                        alert(`View details for ${sellers.username}`)
                      }
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 transition duration-300 ease-in-out transform hover:scale-110"
                      onClick={() => alert(`Edit ${sellers.username}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-green-900 transition duration-300 ease-in-out transform hover:scale-110"
                      onClick={() => handleDelete(sellers.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sellers.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No managers found</div>
      )}
    </div>
  );
};

export default SellerList;
