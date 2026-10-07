require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");
const authRoutes = require("./routes/authRoutes");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Add it to backend/.env (or your host's environment variables).");
  process.exit(1);
}

const app = express();

// Needed on Render/Vercel-style hosts so rate limiting sees the real client IP
app.set("trust proxy", 1);

// CLIENT_URL can be a comma-separated list. If unset, all origins are allowed (as before).
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/+$/, ""))
  : null;

app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusComplaints")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
