const mongoose = require("mongoose");

// 1. PRODUCT SCHEMA
const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => Date.now().toString(),
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    product_price: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 2. USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      default: () => Date.now().toString(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    picture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    email_verified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// 3. CART SCHEMA
const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  product_name: { type: String, required: true },
  product_category: { type: String },
  product_price: { type: String },
  imageURL: { type: String },
  quantity: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// 4. ORDER SCHEMA
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => Date.now().toString(),
    },
    userId: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    sts: {
      type: String,
      default: "preparing",
    },
    status: {
      type: String,
      default: "paid",
    },
    customer: {
      type: Object,
      default: {},
    },
    shipping_details: {
      type: Object,
      default: {},
    },
    intentId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Order = mongoose.model("Order", orderSchema);

module.exports = {
  Product,
  User,
  Cart,
  Order,
};
