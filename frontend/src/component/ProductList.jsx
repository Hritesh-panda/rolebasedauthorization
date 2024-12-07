import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Filter,
  MoveLeftIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3032/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === "price" || sortConfig.key === "ratings.average") {
        const aValue =
          sortConfig.key === "price" ? a[sortConfig.key] : a.ratings.average;
        const bValue =
          sortConfig.key === "price" ? b[sortConfig.key] : b.ratings.average;
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      const aValue = sortConfig.key
        .split(".")
        .reduce((obj, key) => obj[key], a);
      const bValue = sortConfig.key
        .split(".")
        .reduce((obj, key) => obj[key], b);
      return sortConfig.direction === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <ChevronDown className="w-4 h-4 opacity-20" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // delete product

  const handleDelete = async (id) => {
    // Optional: Add a confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    // Set loading state
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3032/deleteproduct/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      // Successfully deleted
      setProducts((prev) => prev.filter((product) => product.id !== id));

      // Optional: Show success notification
      toast.success("Product deleted successfully");
    } catch (err) {
      setError(err.message);
      // Optional: Show error notification
      toast.error(err.message);
    } finally {
      // Clear loading state
      setLoading(false);
    }
  };
  // edit product

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link to={"/dashboard"} className="bg-none text-black">
          Back
        </Link>
      </button>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Product Management</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600">
            <Plus className="w-5 h-5 mr-2 text-black" />
            Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleSort("id")}
                >
                  <span>ID</span>
                  <SortIcon columnKey="id" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleSort("name")}
                >
                  <span>Name</span>
                  <SortIcon columnKey="name" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleSort("category")}
                >
                  <span>Category</span>
                  <SortIcon columnKey="category" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleSort("price")}
                >
                  <span>Price</span>
                  <SortIcon columnKey="price" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleSort("inventory.quantity")}
                >
                  <span>Stock</span>
                  <SortIcon columnKey="inventory.quantity" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleSort("ratings.average")}
                >
                  <span>Rating</span>
                  <SortIcon columnKey="ratings.average" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.inventory.quantity > 50
                          ? "bg-green-100 text-green-800"
                          : product.inventory.quantity > 20
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inventory.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ratings.average} ({product.ratings.count})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => toggleRowExpansion(product.id)}
                    >
                      Details
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit
                        className="w-4 h-4"
                        onClick={() => handleEdit(product.id)}
                      />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2
                        className="w-4 h-4"
                        onClick={() => handleDelete(product.id)}
                      />
                    </button>
                  </td>
                </tr>
                {expandedRows[product.id] && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Specifications:</h4>
                          <pre className="text-sm text-gray-600">
                            {JSON.stringify(product.specifications, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Tags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <h4 className="font-medium mb-2">Description:</h4>
                          <p className="text-sm text-gray-600">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
