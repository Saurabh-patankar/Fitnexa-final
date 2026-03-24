console.log("📂 auth.js file loaded");

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // ✅ This line is critical

const router = express.Router();

// ✅ Signup Route
// ✅ Signup Route
router.post('/signup', async (req, res) => {
  console.log("🟢 Signup route HIT");
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    let finalPassword = password;
    // ⛔️ Only hash if not already a bcrypt hash
    if (!password.startsWith("$2b$")) {
      finalPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
      name,
      email,
      password: finalPassword,
      role: role || 'member'
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email // ✅ Add this
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("🔥 Signup Error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
// ✅ Login Route
router.post('/login', async (req, res) => {
  console.log("🟡 Login route HIT");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log("🔑 Password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 isMatch:", isMatch);

    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email // ✅ Add this
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("🔥 Login Error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;