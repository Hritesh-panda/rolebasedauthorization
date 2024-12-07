import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "./component/Login";
import { AuthProvider, useAuth } from "./component/AuthContext";
import Protectedroutes from "./component/Protectedroutes";

import Userdashboard from "./component/Userdashboard";
import Dashboard from "./component/Dashboard";
import ProductList from "./component/ProductList";
import AddProduct from "./component/AddProduct";
import EditProduct from "./component/EditProduct";
import Manager from "./component/Manager";
import AddManager from "./component/AddManager";
import EditManager from "./component/EditManager";
import SellerList from "./component/SellerList";
import AddSeller from "./component/AddSeller";
import EditSeller from "./component/EditSeller";
import LandingPage from "./component/LandingPage";

const RootRedirect = () => {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role === "employee") {
    return <Navigate to="/employee" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/employee"
            element={
              <Protectedroutes allowedRoles={["employee"]}>
                <Userdashboard />
              </Protectedroutes>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protectedroutes allowedRoles={["admin", "manager", "seller"]}>
                <Dashboard />
              </Protectedroutes>
            }
          />
          <Route
            index
            element={
              <div className="p-4">
                <LandingPage />
              </div>
            }
          />
          <Route
            path="/products"
            element={
              <Protectedroutes allowedRoles={["admin", "manager", "seller"]}>
                <ProductList />
              </Protectedroutes>
            }
          />
          <Route
            path="/add-product"
            element={
              <Protectedroutes allowedRoles={["admin", "manager", "seller"]}>
                <AddProduct />
              </Protectedroutes>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <Protectedroutes allowedRoles={["admin", "manager", "seller"]}>
                <EditProduct />
              </Protectedroutes>
            }
          />
          {/* manager routes admin-only */}
          <Route
            path="/managers"
            element={
              <Protectedroutes allowedRoles={["admin"]}>
                <Manager />
              </Protectedroutes>
            }
          />
          <Route
            path="/add-manager"
            element={
              <Protectedroutes allowedRoles={["admin"]}>
                <AddManager />
              </Protectedroutes>
            }
          />
          <Route
            path="/edit-manager/:id"
            element={
              <Protectedroutes allowedRoles={["admin"]}>
                <EditManager />
              </Protectedroutes>
            }
          />
          {/* seller routes */}
          <Route
            path="/sellers"
            element={
              <Protectedroutes allowedRoles={["admin", "manager"]}>
                <SellerList />
              </Protectedroutes>
            }
          />
          <Route
            path="/add-seller"
            element={
              <Protectedroutes allowedRoles={["admin", "manager"]}>
                <AddSeller />
              </Protectedroutes>
            }
          />
          <Route
            path="/edit-seller/:id"
            element={
              <Protectedroutes allowedRoles={["admin", "manager"]}>
                <EditSeller />
              </Protectedroutes>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
