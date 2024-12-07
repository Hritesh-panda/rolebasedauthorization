import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const AddProduct = () => {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    description: "",
    productUrl: "",
    imageUrl: "",
    price: "",
    category: "",
    brand: "",
    specifications: {
      color: "",
      weight: "",
      // Add more specification fields as needed
    },
    inventory: {
      inStock: true,
      quantity: "",
      warehouse: "",
    },
    ratings: {
      average: 0,
      count: 0,
    },
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested object updates
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProduct((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setProduct((prev) => ({
      ...prev,
      tags: tags,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate a unique ID if not provided
      const productToSubmit = {
        ...product,
        id:
          product.id ||
          `P${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
        price: parseFloat(product.price),
        inventory: {
          ...product.inventory,
          quantity: parseInt(product.inventory.quantity),
        },
      };

      const response = await axios.post(
        "http://localhost:3032/addproduct",
        productToSubmit
      );
      alert("Product added successfully!");
      // Reset form
      setProduct({
        id: "",
        name: "",
        description: "",
        productUrl: "",
        imageUrl: "",
        price: "",
        category: "",
        brand: "",
        specifications: {
          color: "",
          weight: "",
        },
        inventory: {
          inStock: true,
          quantity: "",
          warehouse: "",
        },
        ratings: {
          average: 0,
          count: 0,
        },
        tags: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <>
      {" "}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link to={"/dashboard"} className="text-black">
          Back
        </Link>
      </button>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Product Information */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full p-2 border rounded"
            />
          </div>

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full p-2 border rounded"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              step="0.01"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              placeholder="Category"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="tags"
              value={product.tags.join(", ")}
              onChange={handleTagsChange}
              placeholder="Tags (comma-separated)"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="specifications.color"
              value={product.specifications.color}
              onChange={handleChange}
              placeholder="Color"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="specifications.weight"
              value={product.specifications.weight}
              onChange={handleChange}
              placeholder="Weight"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Inventory */}
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="inventory.quantity"
              value={product.inventory.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="inventory.warehouse"
              value={product.inventory.warehouse}
              onChange={handleChange}
              placeholder="Warehouse"
              className="w-full p-2 border rounded"
            />
            <select
              name="inventory.inStock"
              value={product.inventory.inStock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value={true}>In Stock</option>
              <option value={false}>Out of Stock</option>
            </select>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="url"
              name="productUrl"
              value={product.productUrl}
              onChange={handleChange}
              placeholder="Product URL"
              className="w-full p-2 border rounded"
            />
            <input
              type="url"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
