const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const requiredFields = [
      "name",
      "age",
      "gender",
      "phone",
      "email",
      "height",
      "weight",
      "goal"
    ];

    const profileComplete = requiredFields.every(field => {
      const value = user[field];
      return value !== undefined && value !== null && value !== "";
    });

    res.json({
      msg: "Welcome to the protected dashboard!",
      userId: req.user,
      profileComplete,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ msg: "Error fetching dashboard data" });
  }
});

module.exports = router;