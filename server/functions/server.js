const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const cors = require("cors");
require("dotenv").config();

// Connect to MongoDB Atlas
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas Connected Successfully!"))
    .catch((err) => console.error("MongoDB Connection Error:", err.message));
}

const serviceAccountKey = require("./serviceAccountKey.json");

// Firebase credential
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
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
  return res.send("Firebase Server is running!");
});

// App Router that mirrors the Firebase Cloud Function
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

// Mount under the exact path called by client/src/api/index.js:
// http://localhost:5001/fullstack-food-app02/us-central1/app
app.use("/fullstack-food-app02/us-central1/app", functionApp);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend server successfully running on http://localhost:${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/fullstack-food-app02/us-central1/app`);
});
