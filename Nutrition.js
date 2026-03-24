// models/Nutrition.js
const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 added
    title: { type: String, required: true },
    description: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);