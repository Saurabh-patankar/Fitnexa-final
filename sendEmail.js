const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ FIX: Added `attachments = []` to function parameter
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  await transporter.sendMail({
    from: `"FitNexa" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};

module.exports = sendEmail;