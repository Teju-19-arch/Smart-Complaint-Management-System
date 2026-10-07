const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Slows down brute-force attempts on register/login (per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." }
});

// Used so login takes about the same time whether or not the email exists
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function firstError(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ message: errors.array()[0].msg });
  return true;
}

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

/* ---------- REGISTER ---------- */
router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .bail()
      .matches(EMAIL_RE).withMessage("Please enter a valid email address"),
    body("password")
      .notEmpty().withMessage("Password is required")
      .bail()
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("confirmPassword")
      .notEmpty().withMessage("Please confirm your password")
      .bail()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match")
  ],
  async (req, res) => {
    if (firstError(req, res)) return;

    try {
      const name = req.body.name.trim();
      const email = req.body.email.trim().toLowerCase();

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const hashed = await bcrypt.hash(req.body.password, 10);

      // role is ALWAYS "student" here - anything sent in the request body is ignored
      const user = await User.create({
        name,
        email,
        password: hashed,
        role: "student"
      });

      res.status(201).json({
        message: "Registration successful. You can now log in.",
        user: publicUser(user)
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
);

/* ---------- LOGIN ---------- */
router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .bail()
      .matches(EMAIL_RE).withMessage("Please enter a valid email address"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res) => {
    if (firstError(req, res)) return;

    try {
      const email = req.body.email.trim().toLowerCase();
      const user = await User.findOne({ email });

      // Same message for "no such email" and "wrong password"
      const ok = await bcrypt.compare(req.body.password, user ? user.password : DUMMY_HASH);
      if (!user || !ok) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
);

/* ---------- CURRENT USER ---------- */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
