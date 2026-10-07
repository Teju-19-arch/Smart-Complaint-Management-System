// Creates (or resets) the admin account in MongoDB.
// Usage (from /backend):  npm run seed:admin
// Reads ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI from .env / environment.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (in backend/.env or the environment).");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusComplaints");

  const hashed = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashed;
    existing.role = "admin";
    await existing.save();
    console.log(`Updated existing user ${email} -> admin (password reset)`);
  } else {
    await User.create({ name: "Admin", email, password: hashed, role: "admin" });
    console.log(`Created admin ${email}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
