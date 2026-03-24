const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    membershipType: {
      type: String,
      enum: ["Basic", "Premium", "Elite", "Custom"],
      required: true,
    },
    customDays: {
      type: Number,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Expired"],
      default: "Active",
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
    pausedAt: {
      type: Date,
      default: null,
    },
    totalPausedDays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", MembershipSchema);