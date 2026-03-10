const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);