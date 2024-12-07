import React from "react";

import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect to login page or dashboard
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome</h1>

        <p className="text-gray-600 mb-8">
          Access your dashboard by clicking the login button below
        </p>

        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
