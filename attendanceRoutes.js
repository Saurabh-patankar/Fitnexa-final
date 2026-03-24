const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// Haversine formula to calculate distance (in meters)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ✅ QR Check-in Route
router.post("/checkin", authMiddleware, async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user.userId;

  const gymLat = parseFloat(process.env.GYM_LAT);
  const gymLng = parseFloat(process.env.GYM_LNG);
  const maxRadius = parseFloat(process.env.GYM_RADIUS_METERS || 50);
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  if (!lat || !lng) {
    return res.status(400).json({ message: "📍 Location not provided" });
  }

  // 🔄 Auto-checkout if any active session exceeds 3 hours
  const oldCheckin = await Attendance.findOne({
    userId,
    status: "success",
    checkoutAt: null,
  }).sort({ scannedAt: -1 });

  if (oldCheckin) {
    const durationMs = now - new Date(oldCheckin.scannedAt);
    const durationMin = Math.floor(durationMs / 60000);

    if (durationMin > 180) {
      oldCheckin.checkoutAt = now;
      oldCheckin.durationMinutes = durationMin;
      oldCheckin.status = "auto-checkout";
      await oldCheckin.save();
    } else {
      return res.status(400).json({ message: "❌ Already checked in. Please checkout first." });
    }
  }

  // ✅ Count completed sessions today (auto/manual checkout entries)
  const todayCompleted = await Attendance.countDocuments({
    userId,
    scannedAt: { $gte: todayStart },
    status: { $in: ["checkout", "auto-checkout"] },
  });

  if (todayCompleted >= 2) {
    return res.status(429).json({ message: "❌ Max 2 sessions allowed per day" });
  }

  const distance = getDistance(lat, lng, gymLat, gymLng);
  const isWithinRange = distance <= maxRadius;

  const entry = new Attendance({
    userId,
    scannedAt: now,
    location: { lat, lng },
    status: isWithinRange ? "success" : "rejected",
  });

  await entry.save();

  if (isWithinRange) {
    return res.status(200).json({ message: "✅ Check-in successful" });
  } else {
    return res.status(403).json({
      message: `❌ You're too far from the gym (${Math.round(distance)}m)`,
    });
  }
});

// ✅ Fetch User’s Own Logs
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const rawLogs = await Attendance.find({ userId: req.user.userId }).sort({ scannedAt: -1 });

    const logs = rawLogs.map((entry) => {
      let durationMinutes = entry.durationMinutes;
    
      if (entry.status === "success" && !entry.checkoutAt) {
        const now = new Date();
        durationMinutes = Math.round((now - new Date(entry.scannedAt)) / 60000);
      }
    
      return {
        ...entry.toObject(),
        durationDisplay:
          durationMinutes === 0 || durationMinutes === undefined
            ? "~<1 min"
            : `${durationMinutes} min`,
      };
    });

    console.log("Sending logs with durations:", logs);
    res.json({ logs });
  } catch (err) {
    console.error("mine route error:", err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

// ✅ Live Count of Users Currently Inside
router.get("/livecount", async (req, res) => {
  try {
    const allLogs = await Attendance.find({ status: "success" }).sort({ scannedAt: -1 });

    const activeUsers = new Set();
    const now = new Date();

    allLogs.forEach((log) => {
      const id = log.userId.toString();
      const minutesSince = (now - new Date(log.scannedAt)) / 60000;

      if (!log.checkoutAt && minutesSince <= 180) {
        activeUsers.add(id);
      }
    });

    res.json({ count: activeUsers.size });
  } catch (err) {
    res.status(500).json({ message: "Failed to compute live users" });
  }
});

// ✅ Checkout (Manual or Auto)
// ✅ Checkout (Manual or Auto)
router.post("/checkout", authMiddleware, async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user.userId;

  const gymLat = parseFloat(process.env.GYM_LAT);
  const gymLng = parseFloat(process.env.GYM_LNG);
  const maxRadius = parseFloat(process.env.GYM_RADIUS_METERS || 50);
  const distance = getDistance(lat, lng, gymLat, gymLng);
  const now = new Date();

  // ✅ Limit 2 checkouts per day
  const todayCheckouts = await Attendance.countDocuments({
    userId,
    status: "checkout",
    checkoutAt: {
      $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    },
  });

  if (todayCheckouts >= 2) {
    return res.status(400).json({ message: "❌ Max 2 checkouts allowed per day" });
  }

  // ✅ Require active check-in
  const lastCheckin = await Attendance.findOne({
    userId,
    status: "success",
    checkoutAt: null,
  }).sort({ scannedAt: -1 });

  if (!lastCheckin) {
    return res.status(400).json({ message: "❌ No active check-in found" });
  }

  const durationMs = now - new Date(lastCheckin.scannedAt);
  const durationMinutes = Math.round(durationMs / 60000);

  lastCheckin.checkoutAt = now;
  lastCheckin.durationMinutes = durationMinutes;

  // ✅ 🔥 IMPORTANT: Mark status as "checkout"
  lastCheckin.status = "checkout";

  await lastCheckin.save();
  console.log("Updating checkin:", {
    id: lastCheckin._id,
    durationMinutes,
    status: "checkout",
  });

  const method = distance > maxRadius ? "Auto" : "Manual";

  return res.json({
    message: `✅ ${method} checkout recorded`,
    durationMinutes,
  });
});


// ✅ Admin: All Attendance Logs + Live Users
// Inside routes/attendance.js or wherever it is
router.get("/admin/attendance/all", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const all = await Attendance.find()
      .populate("userId", "name email")
      .sort({ scannedAt: -1 });

    const now = new Date();
    const enrichedLogs = [];
    const liveUsers = new Set();

    for (const entry of all) {
      let isInside = false;
      let durationMinutes = entry.durationMinutes || null;
      let isLong = false;

      if (entry.status === "success") {
        const checkInTime = new Date(entry.scannedAt);
        let checkOutTime = entry.checkoutAt;

        const hoursSinceCheckin = (now - checkInTime) / (1000 * 60 * 60);
        if (!checkOutTime && hoursSinceCheckin >= 24) {
          checkOutTime = now;
          entry.checkoutAt = now;
          entry.durationMinutes = Math.round((checkOutTime - checkInTime) / 60000);
          entry.status = "auto-checkout";
          await entry.save();
        }

        const finalCheckout = checkOutTime || now;
        durationMinutes = Math.round((finalCheckout - checkInTime) / 60000);

        if (!checkOutTime || finalCheckout > new Date(now - 3 * 60 * 60 * 1000)) {
          isInside = true;
          if (entry.userId?._id) liveUsers.add(entry.userId._id.toString());
        }

        if (durationMinutes > 120) {
          isLong = true;
        }
      }

      enrichedLogs.push({
        ...entry.toObject(),
        durationMinutes,
        isInside,
        isLong,
      });
    }

    res.json({ logs: enrichedLogs, liveUsers: [...liveUsers] });
  } catch (err) {
    console.error("❌ Admin fetch error:", err);
    res.status(500).json({ message: "Failed to fetch attendance logs" });
  }
});

module.exports = router;