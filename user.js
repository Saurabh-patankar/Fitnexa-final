const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "trainer", "member"],
      default: "member",
    },

    profilePic: { type: String, default: "" },
    phone: { type: String },
    address: { type: String },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // ✅ Add valid values
    },
    height: { type: Number },
    weight: { type: Number },
    targetWeight: { type: Number },
    goal: {
      type: String,
      enum: ["Fat Loss", "Muscle Gain", "Strength", "Endurance", "General Fitness"], // ✅ Include all
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

console.log("📦 User model loaded");

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);