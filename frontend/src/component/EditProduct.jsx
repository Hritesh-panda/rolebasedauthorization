import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save, X, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    tags: [],
    specifications: {},
    inventory: { quantity: 0 },
    ratings: { average: 0, count: 0 },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3032/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data.data);
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.category.trim()) newErrors.category = "Category is required";

    const priceNum = parseFloat(product.price);
    if (isNaN(priceNum) || priceNum < 0)
      newErrors.price = "Valid price is required";

    const quantityNum = parseInt(product.inventory.quantity);
    if (isNaN(quantityNum) || quantityNum < 0)
      newErrors.quantity = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("inventory.")) {
      setProduct((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          quantity: value,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3032/updateproduct/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      toast.success("Product updated successfully");
      navigate("/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Product Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
                {errors.name && (
                  <span className="text-red-500 ml-2">{errors.name}</span>
                )}
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } shadow-sm py-2 px-3`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
                {errors.brand && (
                  <span className="text-red-500 ml-2">{errors.brand}</span>
                )}
              </label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.brand ? "border-red-500" : "border-gray-300"
                } shadow-sm py-2 px-3`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
                {errors.category && (
                  <span className="text-red-500 ml-2">{errors.category}</span>
                )}
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } shadow-sm py-2 px-3`}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
                {errors.price && (
                  <span className="text-red-500 ml-2">{errors.price}</span>
                )}
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={product.price}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } shadow-sm py-2 px-3`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Quantity
                {errors.quantity && (
                  <span className="text-red-500 ml-2">{errors.quantity}</span>
                )}
              </label>
              <input
                type="number"
                name="inventory.quantity"
                value={product.inventory.quantity}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } shadow-sm py-2 px-3`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow rounded-md border border-gray-300 py-2 px-3"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              <Save className="mr-2 text-black" />
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
