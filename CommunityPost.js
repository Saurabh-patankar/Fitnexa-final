const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communityPostSchema = new mongoose.Schema(
  {
    caption: String,
    imageUrl: String,
    hashtags: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true } // ✅ THIS ENABLES createdAt / updatedAt auto

);

module.exports = mongoose.model("CommunityPost", communityPostSchema);