const multer = require("multer");
const path = require("path");

// ✅ Make sure uploads folder exists: /uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });
module.exports = upload; // ✅ export directly, not inside object