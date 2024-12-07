import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import { Users, ShoppingBag, UserPlus, LogOut, X, Menu } from "lucide-react";
import "./universalstyle.css";

const Dashboard = () => {
  const { role, logOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const getNavigationItems = () => {
    const items = [];
    if (role === "admin") {
      items.push(
        {
          section: "Product Management",
          items: [
            {
              name: "View Products",
              path: "/products",
              icon: <ShoppingBag size={18} />,
            },
            {
              name: "Add Product",
              path: "/add-product",
              icon: <ShoppingBag size={18} />,
            },
          ],
        },
        {
          section: "Manager Management",
          items: [
            {
              name: "View Managers",
              path: "/managers",
              icon: <Users size={18} />,
            },
            {
              name: "Add Manager",
              path: "/add-manager",
              icon: <UserPlus size={18} />,
            },
          ],
        },
        {
          section: "Seller Management",
          items: [
            {
              name: "View Sellers",
              path: "/sellers",
              icon: <Users size={18} />,
            },
            {
              name: "Add Seller",
              path: "/add-seller",
              icon: <UserPlus size={18} />,
            },
          ],
        }
      );
    } else if (role === "manager") {
      items.push(
        {
          section: "Product Management",
          items: [
            {
              name: "View Products",
              path: "/products",
              icon: <ShoppingBag size={18} />,
            },
            {
              name: "Add Product",
              path: "/add-product",
              icon: <ShoppingBag size={18} />,
            },
          ],
        },
        {
          section: "Seller Management",
          items: [
            {
              name: "View Sellers",
              path: "/sellers",
              icon: <Users size={18} />,
            },
            {
              name: "Add Seller",
              path: "/add-seller",
              icon: <UserPlus size={18} />,
            },
          ],
        }
      );
    } else if (role === "seller") {
      items.push({
        section: "Product Management",
        items: [
          {
            name: "View Products",
            path: "/products",
            icon: <ShoppingBag size={18} />,
          },
          {
            name: "Add Product",
            path: "/add-product",
            icon: <ShoppingBag size={18} />,
          },
        ],
      });
    }
    return items;
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path) => {
    // Prevent re-navigation to the current path
    navigate(path, { replace: true });
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed z-50 bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 bg-blue-600">
            <h1 className="text-black-bold text-xl font-bold ps-3">
              Dashboard
            </h1>
            <p className="text-black-bold fs-6 mt-1 text-sm capitalize ps-3">
              Role: {role}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {navigationItems.map((section, index) => (
              <div key={index} className="mb-6">
                <div className="px-3 mb-2 text-sm font-medium text-black-bold">
                  {section.section}
                </div>
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-blue-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-30">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">Welcome Back!</h2>
          </div>
        </header>
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
