const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        progress: {
          dates: { type: [Date], default: [] },
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);