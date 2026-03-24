const express = require("express");
const router = express.Router();
const SavedMeal = require("../models/SavedMeal");
const Nutrition = require("../models/Nutrition");
const { authMiddleware } = require("../middleware/authMiddleware");

// ➕ Save meal as template
router.post("/", authMiddleware, async (req, res) => {
  try {
    const saved = new SavedMeal({ ...req.body, user: req.user.userId });
    await saved.save();
    res.status(201).json({ message: "Template saved", saved });
  } catch (err) {
    console.error("❌ Save meal error:", err);
    res.status(500).json({ message: "Failed to save meal" });
  }
});

// 📄 Get all user's saved templates
router.get("/", authMiddleware, async (req, res) => {
  try {
    const meals = await SavedMeal.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ meals });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved meals" });
  }
});

// ➕ Add from template to today's Nutrition log
router.post("/add/:id", authMiddleware, async (req, res) => {
  try {
    const template = await SavedMeal.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const entry = new Nutrition({
      user: req.user.userId,
      title: template.title,
      description: template.description,
      calories: template.calories,
      protein: template.protein,
      carbs: template.carbs,
      fats: template.fats,
      date: new Date(),
    });

    await entry.save();
    res.status(201).json({ message: "Entry added from template", entry });
  } catch (err) {
    res.status(500).json({ message: "Failed to add from template" });
  }
});

module.exports = router;