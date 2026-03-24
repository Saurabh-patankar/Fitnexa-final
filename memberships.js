const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// ✅ 1. Create Membership
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      membershipType,
      customDays,
      startDate,
      status
    } = req.body;

    const planDays =
      membershipType === "Basic"
        ? 30
        : membershipType === "Premium"
        ? 90
        : membershipType === "Elite"
        ? 180
        : Number(customDays) || 30;

    const start = new Date(startDate || Date.now());
    const end = new Date(start);
    end.setDate(start.getDate() + planDays);

    const membership = new Membership({
      name,
      email,
      phone,
      membershipType,
      startDate: start,
      endDate: end,
      status: status || "Active",
      isPaused: false
    });

    await membership.save();
    res.status(201).json(membership);
  } catch (err) {
    console.error("❌ Membership creation error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ 2. Get all memberships with search + auto-expire
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { membershipType: { $regex: search, $options: 'i' } }
      ];
    }

    let members = await Membership.find(query).sort({ startDate: -1 });

    const now = new Date();
    const expiredUpdates = [];

    for (const m of members) {
      if (m.status !== 'Expired' && m.endDate < now && !m.isPaused) {
        m.status = 'Expired';
        expiredUpdates.push(m.save());
      }
    }

    await Promise.all(expiredUpdates);

    members = await Membership.find(query).sort({ startDate: -1 });

    const formatted = members.map((m) => {
      const daysLeft = Math.max(0, Math.ceil((new Date(m.endDate) - now) / (1000 * 60 * 60 * 24)));
      return {
        _id: m._id,
        name: m.name || "N/A",
        email: m.email || "N/A",
        phone: m.phone || "N/A",
        membershipType: m.membershipType,
        startDate: m.startDate,
        endDate: m.endDate,
        status: m.status,
        isPaused: m.isPaused,
        daysLeft
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Membership fetch error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});
router.get('/my', authMiddleware, requireRole('member', 'admin'), async (req, res) => {
  try {
    const { email, role } = req.user;
    console.log("📥 /api/memberships/my called by:", email, "Role:", role);

    if (!email) return res.status(400).json({ msg: 'User email missing from token' });

    const now = new Date();

    // 🔁 Replace `.findOne().sort()` with sorted `.find()` and pick latest
    const memberships = await Membership.find({ email }).sort({ startDate: -1 });
    if (!memberships || memberships.length === 0) {
      console.warn("⚠️ No memberships found for:", email);
      return res.status(404).json({ msg: 'No membership found for this user' });
    }

    const member = memberships[0];

    // ⏰ Auto-expire logic
    if (member.status !== 'Expired' && member.endDate < now && !member.isPaused) {
      member.status = 'Expired';
      await member.save();
    }

    const daysLeft = Math.max(0, Math.ceil((new Date(member.endDate) - now) / (1000 * 60 * 60 * 24)));

    res.json({
      _id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      startDate: member.startDate,
      endDate: member.endDate,
      status: member.status,
      isPaused: member.isPaused,
      daysLeft,
    });
  } catch (err) {
    console.error("❌ Fetching /my membership failed:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ 3. Update membership
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Membership update failed:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ 4. Delete membership
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ 5. Get single membership
router.get('/:id', authMiddleware, requireRole('admin','member'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });
    res.json(member);
  } catch (err) {
    console.error("❌ GET single member error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ 6. Toggle pause/resume
router.patch('/:id/toggle-pause', authMiddleware, requireRole('admin','member'), async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });

    const now = new Date();

    if (!member.isPaused) {
      member.isPaused = true;
      member.status = "Paused";
      member.pausedAt = now;
    } else {
      const pausedAt = member.pausedAt;
      const diffDays = Math.ceil((now - pausedAt) / (1000 * 60 * 60 * 24));

      member.isPaused = false;
      member.status = "Active";
      member.pausedAt = null;
      member.totalPausedDays = (member.totalPausedDays || 0) + diffDays;

      const newEndDate = new Date(member.endDate);
      newEndDate.setDate(newEndDate.getDate() + diffDays);
      member.endDate = newEndDate;
    }

    const updated = await member.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Pause/resume failed:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
// ✅ 7. Get current user's memberships (for non-admin users)
// ✅ USER: Get current user's own memberships
// ✅ 2.1 Get current user's membership (for role: member)

module.exports = router;