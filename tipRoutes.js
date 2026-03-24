const express = require("express");
const router = express.Router();

// ✅ Use a static array for now
const tips = [
  "Drink at least 2.5L of water today and stretch for 10 minutes before working out.",
  "Do 15 minutes of fasted cardio in the morning.",
  "Include more protein in your breakfast today.",
  "Try deep breathing after your workout to aid recovery.",
  "Don’t skip your post-workout meal — recovery is key!",
  "Avoid screens 1 hour before bed to improve sleep recovery.",
  "Incorporate mobility exercises into your warmup.",
  "Replace sugary drinks with lemon water today.",
  "Go for a walk after meals to aid digestion.",
  "Try a HIIT session for 20 mins if you’re short on time."
];

// ✅ Route: GET /api/tips/random
router.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * tips.length);
  const tip = tips[randomIndex];
  res.json({ tip });
});

module.exports = router;