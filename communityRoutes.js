const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CommunityPost = require("../models/CommunityPost");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const User = require("../models/user");
// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// GET all posts
// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 }) // ✅ Newest first
      .populate("userId", "name");
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: "Failed to load posts" });
  }
});

// POST new post
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { caption, hashtags } = req.body;

    const post = new CommunityPost({
      caption,
      imageUrl: req.file?.filename,
      hashtags: hashtags ? hashtags.split(",").map(t => t.trim()) : [],
      userId: req.user._id,
    });

    await post.save();
    res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// DELETE post (admin or owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = post.userId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner)
      return res.status(403).json({ error: "Unauthorized" });

    if (post.imageUrl) {
      const filePath = path.join(__dirname, "../uploads", post.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.deleteOne();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST a comment
router.post("/:postId/comments", authMiddleware, async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({
      text,
      userId: req.user.userId,
    });

    post.markModified("comments"); // ✅ ensure Mongoose sees nested change
    await post.save({ validateBeforeSave: false }); // ✅ skip full post validation

    res.status(201).json({ msg: "Comment added", comments: post.comments });
  } catch (err) {
    console.error("❌ Add comment failed:", err);
    res.status(500).json({ msg: "Failed to add comment" });
  }
});
// ✅ GET comments for a post
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await CommunityPost.findById(postId).populate("comments.userId", "name");
    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.status(200).json({ comments: post.comments });
  } catch (err) {
    console.error("❌ Fetch comments failed:", err);
    res.status(500).json({ msg: "Failed to get comments" });
  }
});

// POST /api/community/:id/like => Like/unlike toggle
// ✅ Toggle like for a post
// POST /api/community/:id/like
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;

    // Toggle like
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save({ validateBeforeSave: false }); // ✅ Skip schema validation here

    res.json({ message: "Like toggled", likes: post.likes });
  } catch (err) {
    console.error("Like toggle failed:", err);
    res.status(500).json({ message: "Failed to toggle like", error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const query = {
      $or: [
        { caption: new RegExp(q, "i") },
        { hashtags: new RegExp(q, "i") },
      ],
    };

    const posts = await CommunityPost.find(query)
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
});

// GET /api/community/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await CommunityPost.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name");
    
    const user = await User.findById(req.params.userId).select("name");
    res.json({ posts, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch user's posts" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { caption } = req.body;
    const update = { caption };
    if (req.file) update.imageUrl = req.file.filename;
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.get("/stats/engagement", requireRole("admin"), async (req, res) => {
  try {
    const posts = await CommunityPost.find();
    const stats = posts.map((p) => ({
      id: p._id,
      caption: p.caption,
      likes: p.likes.length,
      comments: p.comments.length,
    }));
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: "Stats fetch failed" });
  }
});

router.post("/follow/:targetId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const target = await User.findById(req.params.targetId);
    if (!user || !target) return res.status(404).json({ error: "User not found" });

    const isFollowing = user.following.includes(target._id);
    if (isFollowing) {
      user.following.pull(target._id);
      target.followers.pull(user._id);
    } else {
      user.following.push(target._id);
      target.followers.push(user._id);
    }
    await user.save();
    await target.save();
    res.json({ success: true, following: !isFollowing });
  } catch {
    res.status(500).json({ error: "Follow toggle failed" });
  }
});

router.put(
  "/:postId",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { caption } = req.body;
      const imageUrl = req.file?.filename;

      const update = { caption };
      if (imageUrl) update.imageUrl = imageUrl;

      const post = await CommunityPost.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (String(post.userId) !== String(req.user._id)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await CommunityPost.findByIdAndUpdate(postId, update, { new: true });

      res.json({ message: "Post updated successfully" });
    } catch (err) {
      console.error("Edit post error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find()
    .populate("userId", "name profilePic")
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
  .limit(10);
     

    res.json({ posts });
  } catch (err) {
    console.error("Community fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;