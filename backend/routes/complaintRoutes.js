const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaint");
const multer = require("multer");

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });


// CREATE COMPLAINT
router.post("/add", upload.single("image"), async (req, res) => {

  try {

    const complaint = new Complaint({
      description: req.body.description,
      image: req.file ? req.file.filename : "",
      status: "Pending"
    });

    await complaint.save();

    res.json({ message: "Complaint submitted" });

  } catch (error) {
    res.status(500).json(error);
  }

});


// GET ALL COMPLAINTS
router.get("/", async (req, res) => {

  try {

    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {

    res.status(500).json(error);

  }

});


// RESOLVE COMPLAINT
router.put("/resolve/:id", async (req, res) => {

  try {

    await Complaint.findByIdAndUpdate(req.params.id, {
      status: "Resolved"
    });

    res.json({ message: "Complaint resolved" });

  } catch (error) {

    res.status(500).json(error);

  }

});

module.exports = router;