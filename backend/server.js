const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/campusComplaints")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});