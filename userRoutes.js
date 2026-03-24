const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("📩 Incoming profile data:", req.body);

    const existingUser = await User.findById(req.user.userId);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Only update allowed fields
    const fieldsToUpdate = [
      "name", "age", "gender", "address",
      "phone", "height", "weight", "targetWeight",
      "goal", "profilePic"
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        existingUser[field] = req.body[field];
      }
    });

    await existingUser.save();

    res.json({ msg: "✅ Profile updated", user: existingUser });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

module.exports = router;