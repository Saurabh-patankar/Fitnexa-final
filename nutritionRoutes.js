const express = require("express");
const router = express.Router();
const Nutrition = require("../models/Nutrition");
const { authMiddleware } = require("../middleware/authMiddleware");
// POST - Add nutrition entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = new Nutrition({
      ...req.body,
      user: req.user.userId, // ✅ attach user
    });
    await data.save();
    res.status(201).json({ message: "Nutrition entry added", data });
  } catch (err) {
    console.error("❌ Nutrition save error:", err);
    res.status(500).json({ message: "Failed to save nutrition data" });
  }
});
// GET - All nutrition entries
router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === "admin"
      ? {} // admin sees all
      : { user: req.user.userId }; // regular user sees own

    const all = await Nutrition.find(query).sort({ createdAt: -1 });
    res.status(200).json({ entries: all });
  } catch (err) {
    console.error("❌ Nutrition fetch error:", err);
    res.status(500).json({ message: "Failed to fetch nutrition entries" });
  }
});

// PUT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Nutrition.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const isOwner = entry.user.toString() === req.user.userId;
const isAdmin = req.user.role === "admin";

if (!isOwner && !isAdmin) {
  return res.status(403).json({ message: "Unauthorized" });
}
    const updated = await Nutrition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Entry updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Nutrition.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const isOwner = entry.user.toString() === req.user.userId;
const isAdmin = req.user.role === "admin";

if (!isOwner && !isAdmin) {
  return res.status(403).json({ message: "Unauthorized" });
}

    await Nutrition.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
});
const Template = require("../models/NutritionTemplate");


// ➕ Save template
router.post("/templates", authMiddleware, async (req, res) => {
  try {
    const data = new Template({ ...req.body, user: req.user.userId });
    await data.save();
    res.status(201).json({ message: "Template saved", data });
  } catch (err) {
    console.error("❌ Template save error:", err);
    res.status(500).json({ message: "Failed to save template" });
  }
});

// 📦 Get user's templates
router.get("/templates", authMiddleware, async (req, res) => {
  try {
    const templates = await Template.find({ user: req.user.userId });
    res.status(200).json({ templates });
  } catch (err) {
    res.status(500).json({ message: "Failed to load templates" });
  }
});

// ❌ Delete template
router.delete("/templates/:id", authMiddleware, async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Template deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;