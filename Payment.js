const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      required: true,
    },
    membershipType: {
      type: String,
      enum: ["Basic", "Premium", "Elite", "Custom"],
    },
    customDays: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "Cash", "Razorpay"], // ✅ Add Razorpay here
      default: "UPI",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);