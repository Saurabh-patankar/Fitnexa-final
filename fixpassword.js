const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

mongoose
  .connect("mongodb+srv://new:12345@fitnexacluster.3gzly6w.mongodb.net/fitnexa?retryWrites=true&w=majority&appName=FitNexaCluster")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

async function fix() {
  const user = await User.findOne({ email: "trial@gmail.com" });

  if (!user) {
    console.log("❌ User not found");
    process.exit();
  }

  const newPassword = "123456"; // ✅ Set new password here
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  // force reset to 123456
user.password = await bcrypt.hash("123456", 10);
await user.save();
console.log("✅ Forced password set to 123456 for:", user.email);

  console.log(`✅ Password reset for: ${user.email}`);
  process.exit();
}

fix();