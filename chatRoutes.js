const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const { authMiddleware } = require("../middleware/authMiddleware");

// ➕ Save message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { role, content } = req.body;
    const message = await ChatMessage.create({
      user: req.user.userId,
      role,
      content,
    });
    res.status(201).json({ message });
  } catch (err) {
    console.error("❌ Chat save error:", err);
    res.status(500).json({ message: "Failed to save message" });
  }
});

// 📥 Get all messages
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user.userId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (err) {
    console.error("❌ Chat fetch error:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});
router.delete("/", authMiddleware, async (req, res) => {
    try {
      await ChatMessage.deleteMany({ user: req.user.userId });
      res.json({ message: "Chat cleared" });
    } catch (err) {
      res.status(500).json({ message: "Failed to clear chat" });
    }
  });
module.exports = router;