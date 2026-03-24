const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

// ✅ Init Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ POST /api/razorpay/create-order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error('❌ Razorpay create-order error:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

module.exports = router;