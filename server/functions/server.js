const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Connect to MongoDB Atlas with optimized cloud options
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    })
    .then(() => console.log("MongoDB Atlas Connected Successfully!"))
    .catch((err) => console.error("MongoDB Connection Error:", err.message));
}

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// Root check
app.get("/", (req, res) => {
  return res.send("Food Delivery API Server is running!");
});

// App Router for REST API (supports /api/users and /api/products)
const functionApp = express();
functionApp.use(cors({ origin: true }));
functionApp.use(express.json({ limit: "50mb" }));
functionApp.use(express.urlencoded({ extended: true, limit: "50mb" }));
functionApp.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

functionApp.get("/", (req, res) => {
  return res.send("hello world from food app function");
});

const userRoute = require("./routes/user");
functionApp.use("/api/users", userRoute);

const productRoute = require("./routes/products");
functionApp.use("/api/products", productRoute);

// Mount under both the legacy path and root for flexible cloud hosting (Render, Railway, Vercel, etc.)
app.use("/fullstack-food-app02/us-central1/app", functionApp);
app.use("/", functionApp);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server successfully running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/fullstack-food-app02/us-central1/app`);
});
