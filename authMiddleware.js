const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.warn("⛔️ No token provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 Decoded JWT:", decoded);

    const user = await User.findById(decoded.userId).select("role _id name email");
    if (!user) {
      console.warn("⛔️ User not found in DB for decoded userId");
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = {
      userId: user._id.toString(),
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email || "", // ✅ fallback
    };

    console.log("🧪 Authenticated user:", req.user);
    next();
  } catch (err) {
    console.error("❌ Invalid token or auth error:", err.message);
    res.status(403).json({ msg: "Token is not valid" });
  }
};

// ✅ Role check middleware
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.warn("⛔️ Role check failed: req.user is missing");
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (req.user.role === "admin") return next(); // Always allow admin

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`⛔️ Role '${req.user.role}' not allowed, needs: ${allowedRoles}`);
      return res.status(403).json({ msg: "Access denied: insufficient permissions" });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole,
};