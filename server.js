require('dotenv').config(); // ✅ Load environment variables early
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

// Import Routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const membershipRoutes = require('./routes/memberships');
const paymentRoutes = require('./routes/paymentRoutes');
const challengeRoutes = require("./routes/challengeRoutes");
const communityRoutes = require("./routes/communityRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const tipRoutes = require("./routes/tipRoutes");
const savedMealRoutes = require("./routes/savedMealRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const razorpayRoutes = require('./routes/razorpayRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Initialize App
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images

// ✅ Logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// ✅ Webhook needs raw body before JSON parsing
app.use(
  "/api/webhook",
  express.json({ verify: (req, res, buf) => { req.rawBody = buf } }),
  webhookRoutes
);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/savedmeals", savedMealRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use("/api/user", userRoutes);
app.use("/api", dashboardRoutes);

// ✅ MongoDB + Server Boot
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });


// ✅ Cron Jobs (only after mongoose connection is safe)
// const { startAutoCheckoutJob } = require("./cron/autoCheckout");
// startAutoCheckoutJob();
