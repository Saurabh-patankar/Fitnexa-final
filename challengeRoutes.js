const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Challenge = require("../models/Challenge");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// ✅ CREATE a new challenge (admin or trainer only)
router.post("/", authMiddleware, requireRole("admin", "trainer"), async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;

    const challenge = new Challenge({
      title,
      description,
      startDate,
      endDate,
      status,
    });

    await challenge.save();
    res.status(201).json({ message: "Challenge created", challenge });
  } catch (err) {
    console.error("❌ Error creating challenge:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ GET all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ challenges });
  } catch (err) {
    console.error("❌ Error fetching challenges:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ JOIN challenge (fully fixed)
// const mongoose = require("mongoose");

// ✅ JOIN challenge
router.post("/join/:id", authMiddleware, async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.user?.userId;

  try {
    console.log("🧠 userId passed to push:", userId);

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const alreadyJoined = challenge.participants?.some(
      (p) => p.user?.toString() === userId
    );
    if (alreadyJoined) return res.status(400).json({ message: "Already joined" });

    // ✅ SAFETY CHECK: Prevent corrupted participants array
    challenge.participants = challenge.participants.filter(p => p.user); // Remove broken ones

    // ✅ Safe push
    challenge.participants.push({
      user: userId,
      progress: { dates: [] },
    });

    console.log("✅ participants (before save):", challenge.participants);

    await challenge.save();

    res.status(200).json({ message: "Joined successfully" });
  } catch (err) {
    console.error("❌ Join challenge failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update Challenge
router.put("/:id", authMiddleware, requireRole("admin", "trainer"), async (req, res) => {
  try {
    const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Challenge updated", challenge: updated });
  } catch (err) {
    console.error("❌ Failed to update challenge:", err.message);
    res.status(500).json({ message: "Failed to update challenge" });
  }
});

// ✅ Delete Challenge
router.delete("/:id", authMiddleware, requireRole("admin", "trainer"), async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Challenge deleted" });
  } catch (err) {
    console.error("❌ Failed to delete challenge:", err.message);
    res.status(500).json({ message: "Failed to delete challenge" });
  }
});

// ✅ PROGRESS log
router.post("/progress/:id", authMiddleware, async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.user?.userId;
  const today = new Date().toDateString();

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const participant = challenge.participants.find(
      (p) => p.user?.toString() === userId.toString()
    );
    if (!participant) {
      return res.status(400).json({ message: "You haven't joined this challenge yet" });
    }

    if (!participant.progress) {
      participant.progress = { dates: [] };
    }

    const alreadyMarked = participant.progress.dates.some(
      (d) => new Date(d).toDateString() === today
    );

    if (alreadyMarked) {
      return res.status(400).json({ message: "Already marked today" });
    }

    participant.progress.dates.push(new Date());
    await challenge.save();

    res.status(200).json({ message: "Progress marked for today" });
  } catch (err) {
    console.error("❌ Progress update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LEADERBOARD
router.get("/leaderboard/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate("participants.user", "name");
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const leaderboard = challenge.participants
      .filter((p) => p.user)
      .map((p) => ({
        name: p.user.name,
        streak: p.progress?.dates?.length || 0,
      }))
      .sort((a, b) => b.streak - a.streak);

    res.status(200).json({ leaderboard });
  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;