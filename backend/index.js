const express = require("express");
const cors = require("cors");
const userData = require("./data.json");
const productData = require("./product.json");
const fs = require("fs");
const app = express();
const USER_DATA_PATH = "./data.json";
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/users", async (req, res) => {
  try {
    await fs.readFile("./data.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const users = JSON.parse(data);
        res.send(users);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
// login routes

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = userData.user.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.status(200).json({ role: user.role });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// get product data

app.get("/products", (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;
    let filteredProducts = productData.products;
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (brand) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    res.json({
      status: "success",
      count: filteredProducts.length,
      data: filteredProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// GET product by ID
app.get("/products/:id", (req, res) => {
  try {
    const product = productData.products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// add product

// Add product route
app.post("/addproduct", (req, res) => {
  try {
    // Read existing products
    const productsData = JSON.parse(fs.readFileSync("./product.json", "utf8"));

    // Generate new product ID
    const newProductId = `P${(productsData.products.length + 1)
      .toString()
      .padStart(3, "0")}`;

    // Create new product object
    const newProduct = {
      id: newProductId,
      ...req.body,
      // Ensure required fields are present
      ratings: req.body.ratings || { average: 0, count: 0 },
      inventory: req.body.inventory || {
        inStock: true,
        quantity: 0,
        warehouse: "",
      },
      tags: req.body.tags || [],
    };

    // Add new product to products array
    productsData.products.push(newProduct);

    // Update count
    productsData.count = productsData.products.length;

    // Write updated products back to file
    fs.writeFileSync("./product.json", JSON.stringify(productsData, null, 2));

    // Respond with the new product
    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// delete the product

// DELETE product route
app.delete("/deleteproduct/:id", (req, res) => {
  try {
    // Read existing products
    const productsData = JSON.parse(fs.readFileSync("./product.json", "utf8"));

    // Find the index of the product to delete
    const productIndex = productsData.products.findIndex(
      (product) => product.id === req.params.id
    );

    // If product not found, return 404
    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Remove the product from the array
    productsData.products.splice(productIndex, 1);

    // Update count
    productsData.count = productsData.products.length;

    // Write updated products back to file
    fs.writeFileSync("./product.json", JSON.stringify(productsData, null, 2));

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// UPDATE product route
app.put("/updateproduct/:id", (req, res) => {
  try {
    // Read existing products
    const productsData = JSON.parse(fs.readFileSync("./product.json", "utf8"));

    // Find the index of the product to update
    const productIndex = productsData.products.findIndex(
      (product) => product.id === req.params.id
    );

    // If product not found, return 404
    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Merge existing product with updated fields
    const updatedProduct = {
      ...productsData.products[productIndex],
      ...req.body,
      id: req.params.id, // Ensure ID remains the same
    };

    // Validate required fields
    if (
      !updatedProduct.name ||
      !updatedProduct.brand ||
      !updatedProduct.category
    ) {
      return res.status(400).json({
        status: "error",
        message: "Name, brand, and category are required",
      });
    }

    // Replace the old product with the updated product
    productsData.products[productIndex] = updatedProduct;

    // Write updated products back to file
    fs.writeFileSync("./product.json", JSON.stringify(productsData, null, 2));

    // Respond with the updated product
    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update product",
      error: error.message,
    });
  }
});
// manager api's

app.get("/managers", (req, res) => {
  const managerUsers = userData.user.filter((user) => user.role === "manager");
  res.json(managerUsers);
});

//add manager
app.post("/addmanager", (req, res) => {
  try {
    // Ensure the data file exists
    if (!fs.existsSync(USER_DATA_PATH)) {
      fs.writeFileSync(USER_DATA_PATH, JSON.stringify({ user: [] }, null, 2));
    }

    // Read existing user data
    let userData = JSON.parse(fs.readFileSync(USER_DATA_PATH, "utf8"));

    // Check if username already exists
    const existingUser = userData.user.find(
      (u) => u.username === req.body.username
    );

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    // Generate new user ID
    const newUserId =
      userData.user.length > 0
        ? Math.max(...userData.user.map((u) => u.id)) + 1
        : 1;

    // Create new user object
    const newUser = {
      id: newUserId,
      username: req.body.username,
      password: req.body.password,
      role: "manager",
    };

    // Add new user to the array
    userData.user.push(newUser);

    // Write updated user data back to file
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(userData, null, 2));

    // Respond with the new user details (excluding password)
    const { password, ...userResponse } = newUser;
    res.status(201).json({
      status: "success",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add manager",
      error: error.message,
    });
  }
});
// delete manager
app.delete("/deletemanager/:id", (req, res) => {
  try {
    // Read the existing user data
    const data = JSON.parse(fs.readFileSync(USER_DATA_PATH, "utf8"));

    // Convert req.params.id to a number
    const managerId = Number(req.params.id);

    // Find the index of the manager to delete
    const managerIndex = data.user.findIndex((user) => user.id === managerId);

    // If manager not found, return 404
    if (managerIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: `Manager with id ${managerId} not found`,
      });
    }

    // Remove the manager from the array
    data.user.splice(managerIndex, 1);

    // Update count (if needed)
    data.count = data.user.length;

    // Write updated data back to the file
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(data, null, 2));

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: `Manager with id ${managerId} deleted successfully`,
    });
  } catch (error) {
    console.error("Error in /deletemanager:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to delete manager",
      error: error.message,
    });
  }
});
// seller api's
// view sellers
app.get("/sellers", (req, res) => {
  const sellerUsers = userData.user.filter((user) => user.role === "seller");
  res.json(sellerUsers);
});
// add seller

app.post("/addseller", (req, res) => {
  try {
    // Ensure the data file exists
    if (!fs.existsSync(USER_DATA_PATH)) {
      fs.writeFileSync(USER_DATA_PATH, JSON.stringify({ user: [] }, null, 2));
    }

    // Read existing user data
    let userData = JSON.parse(fs.readFileSync(USER_DATA_PATH, "utf8"));

    // Check if username already exists
    const existingUser = userData.user.find(
      (u) => u.username === req.body.username
    );

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    // Generate new user ID
    const newUserId =
      userData.user.length > 0
        ? Math.max(...userData.user.map((u) => u.id)) + 1
        : 1;

    // Create new user object
    const newUser = {
      id: newUserId,
      username: req.body.username,
      password: req.body.password,
      role: "seller",
    };

    // Add new user to the array
    userData.user.push(newUser);

    // Write updated user data back to file
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(userData, null, 2));

    // Respond with the new user details (excluding password)
    const { password, ...userResponse } = newUser;
    res.status(201).json({
      status: "success",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add seller",
      error: error.message,
    });
  }
});
// delete seller
app.delete("/deleteseller/:id", (req, res) => {
  try {
    // Read existing user data
    const usersData = JSON.parse(fs.readFileSync(USER_DATA_PATH, "utf8"));

    // Convert id to number for comparison
    const userId = Number(req.params.id);

    // Find the index of the user to delete
    const userIndex = usersData.user.findIndex((user) => user.id === userId);

    // If user not found, return 404
    if (userIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: `User with id ${userId} not found`,
      });
    }

    // Remove the user from the array
    usersData.user.splice(userIndex, 1);

    // Update count (if applicable)
    usersData.count = usersData.user.length;

    // Write updated user data back to file
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(usersData, null, 2));

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      id: userId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

app.listen(3032, () => {
  console.log("Example app listening on port 3032!");
});

module.exports = app;
