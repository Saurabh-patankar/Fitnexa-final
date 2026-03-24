const mongoose = require("mongoose");

const savedMealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.models.SavedMeal || mongoose.model("SavedMeal", savedMealSchema);