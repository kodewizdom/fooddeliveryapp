const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const getAdminEmails = () => {
  const envAdmin = process.env.ADMIN_EMAIL || "immortalproject01@gmail.com";
  return [envAdmin.toLowerCase(), "immortalproject01@gmail.com"];
};

// 1. JWT VERIFICATION (Validates token and returns user profile)
router.get("/jwtVerification", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ success: false, msg: "Token Not Found" });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_jwt_secret"
    );

    if (!decodedValue) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized access" });
    }

    const user = await User.findOne({ user_id: decodedValue.user_id }).select(
      "-password"
    );
    if (user && getAdminEmails().includes(user.email.toLowerCase()) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }
    const userData = user ? user.toObject() : decodedValue;

    return res.status(200).json({ success: true, data: userData });
  } catch (err) {
    return res.status(401).send({
      success: false,
      msg: `Error in extracting the token: ${err.message}`,
    });
  }
});

// 2. USER SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, picture } = req.body;
    const name = req.body.name || (email ? email.split("@")[0] : "User");

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide email and password" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user_id = Date.now().toString();
    const isAdmin = getAdminEmails().includes(email.toLowerCase());
    const newUser = await User.create({
      user_id,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      picture:
        picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      email_verified: true,
      role: isAdmin ? "admin" : "user",
    });

    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "30d" }
    );

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      data: userObj,
      token,
      msg: "User registered successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: `Error: ${err.message}` });
  }
});

// 3. USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid password credentials" });
    }

    if (getAdminEmails().includes(user.email.toLowerCase()) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "30d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      data: userObj,
      token,
      msg: "Login successful",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: `Error: ${err.message}` });
  }
});

// 4. GET ALL USERS (For Admin Dashboard)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      data: users,
      dataCount: users.length,
    });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in listing users: ${err.message}`,
    });
  }
});

// 5. GOOGLE LOGIN (MongoDB JWT login/register)
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    const isAdmin = getAdminEmails().includes(email.toLowerCase());
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        user_id: Date.now().toString(),
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        picture:
          picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        email_verified: true,
        role: isAdmin ? "admin" : "user",
      });
    } else if (isAdmin && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "30d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      data: userObj,
      token,
      msg: "Google login successful",
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: `Error: ${err.message}` });
  }
});

module.exports = router;