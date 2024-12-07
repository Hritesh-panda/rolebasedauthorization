import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SellerList = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "seller",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Both username and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3032/addseller",
        formData
      );
      console.log("Server Response:", response.data);
      setSuccess("Manager added successfully!");

      // Reset form fields
      setFormData({ username: "", password: "", role: "manager" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to add manager. Please try again.";
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6">
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Add Manager Form */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg px-8 py-10">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Add New Seller
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Add seller
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerList;
