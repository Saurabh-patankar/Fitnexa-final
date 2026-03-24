const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ["success", "rejected", "checkout", "auto-checkout"],
    default: "success",
  },
  checkoutAt: {
    type: Date,
    default: null,
  },
  durationMinutes: {
    type: Number, // calculated as minutes between checkin and checkout
    default: 0,
  }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);