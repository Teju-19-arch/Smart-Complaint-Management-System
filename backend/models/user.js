const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    // bcrypt hash only - the plain password is never stored
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    }
  },
  { timestamps: true }
);

// Safety net: never leak the hash if a user document is sent as JSON
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", UserSchema);
