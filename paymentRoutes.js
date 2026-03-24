const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Membership = require("../models/Membership");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Record manual Payment
router.post("/", authMiddleware, requireRole("admin", "member", "trainer"), async (req, res) => {
  try {
    console.log("📥 Incoming payment body:", req.body);
    const {
      memberName,
      email,
      phone,
      amount,
      status,
      membershipType,
      customDays,
      paymentMethod,
    } = req.body;

    const userId = req.user.userId;

    const payment = new Payment({
      userId,
      memberName,
      email,
      phone,
      amount,
      status,
      membershipType,
      customDays,
      paymentMethod,
    });
    await payment.save();

    // Auto-create Membership
    if (status === "Paid") {
      let days = 30;
      if (membershipType === "Premium") days = 90;
      else if (membershipType === "Elite") days = 180;
      else if (membershipType === "Custom" && customDays) {
        days = parseInt(customDays);
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + days);

      await Membership.create({
        userId,
        membershipType,
        startDate,
        endDate,
        status: "Active",
        isPaused: false,
        name: memberName,
        email,
        phone,
      });
    }

    res.status(201).json({ message: "Payment recorded and membership updated", payment });
  } catch (error) {
    console.error("❌ Error in payment POST:", error);
    res.status(500).json({ message: "Payment failed", error });
  }
});

// ✅ Get Payments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    let payments;
    if (user.role === "admin") {
      payments = await Payment.find().sort({ createdAt: -1 });
    } else {
      payments = await Payment.find({ userId: user.userId }).sort({ createdAt: -1 });
    }

    res.json({ payments });
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

// ✅ Update Payment
router.put("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Payment update error:", err);
    res.status(500).json({ message: "Payment update failed" });
  }
});

// ✅ Delete Payment
router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted" });
  } catch (err) {
    console.error("❌ Payment delete error:", err);
    res.status(500).json({ message: "Payment delete failed" });
  }
});

// ✅ Get User's Payments
router.get("/my", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
  res.json({ payments });
});

// ✅ Create Razorpay Order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `fitnexa_rcpt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay create-order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// ✅ Razorpay Verify + Renewal Logic
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      memberId,
      membershipType,
      startDate,
      amount,
      paymentMethod,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid Razorpay signature" });
    }

    // Determine duration
    let duration = 30;
    if (membershipType === "Premium") duration = 90;
    else if (membershipType === "Elite") duration = 180;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + duration);

    const member = await Membership.findById(memberId);
    if (!member) return res.status(404).json({ msg: "Member not found" });

    // 🛠 Do NOT overwrite original startDate
    member.membershipType = membershipType;
    member.endDate = end;
    member.status = "Active";
    member.isPaused = false;
    member.pausedAt = null;
    await member.save();

    // Save payment
    await Payment.create({
      userId: req.user.userId,
      memberName: req.user.name,
      email: req.user.email,
      phone: "",
      amount,
      membershipType,
      status: "Paid",
      paymentMethod,
    });

    const generateAndSendReceipt = require("../utils/generateReceipt");

// After membership + payment saved
await generateAndSendReceipt({
  name: req.user.name,
  email: req.user.email,
  membershipType,
  startDate,
  endDate: end, // ← This should match backend logic
  amount,
});

    // ✅ Send confirmation email
    await sendEmail({
      to: req.user.email,
      subject: "🎉 FitNexa – Membership Renewal Confirmed",
      html: `
        <h2>Hi ${req.user.name},</h2>
        <p>Thank you for renewing your <strong>${membershipType}</strong> membership.</p>
        <ul>
          <li>🗓 <strong>Start Date:</strong> ${start.toDateString()}</li>
          <li>📅 <strong>End Date:</strong> ${end.toDateString()}</li>
          <li>💳 <strong>Amount:</strong> ₹${amount}</li>
        </ul>
        <p>We’re excited to have you back on board. 💪</p>
        <p>– Team FitNexa</p>
      `,
    });

    res.json({ msg: "Payment verified and membership renewed" });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ msg: "Verification failed", error: err.message });
  }
});

module.exports = router;