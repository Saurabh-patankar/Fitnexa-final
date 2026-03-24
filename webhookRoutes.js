const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const webhookSecret = 'fitnexa_secret_123'; // use the same one as in Razorpay

router.post('/razorpay', express.json({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature === expectedSignature) {
    console.log('✅ Razorpay Webhook Verified:', req.body.event);
    // handle payment.authorized, payment.failed, etc.
    res.status(200).json({ status: 'ok' });
  } else {
    console.warn('❌ Invalid Razorpay signature!');
    res.status(400).json({ status: 'invalid signature' });
  }
});

module.exports = router;