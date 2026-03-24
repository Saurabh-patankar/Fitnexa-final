const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const sendEmail = require("./sendEmail");

const generateAndSendReceipt = async ({
  name,
  email,
  membershipType,
  startDate,
  endDate,
  amount,
}) => {
  try {
    // Ensure receipts folder exists
    const receiptsDir = path.join(__dirname, "../receipts");
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir);
    }

    const fileName = `receipt_${Date.now()}.pdf`;
    const receiptPath = path.join(receiptsDir, fileName);

    await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(receiptPath);
      doc.pipe(stream);

      // Add receipt content
      doc
        .image(path.join(__dirname, "../assets/logo_fitnexa.png"), { width: 100 })
        .fontSize(20)
        .text("FitNexa Membership Receipt", { align: "center" })
        .moveDown();

      doc.fontSize(12).text(`Name: ${name}`);
      doc.text(`Email: ${email}`);
      doc.text(`Membership Plan: ${membershipType}`);
      doc.text(`Start Date: ${new Date(startDate).toDateString()}`);
      doc.text(`End Date: ${new Date(endDate).toDateString()}`);
      doc.text(`Amount Paid: ₹${amount}`);
      doc.text(`Payment Method: Razorpay`);
      doc.moveDown().text("💪 Thanks for staying Fit with FitNexa!", { align: "left" });

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // After PDF is ready, send email
    await sendEmail({
      to: email,
      subject: "🎉 FitNexa – Membership Receipt",
      html: `<p>Hi ${name},</p><p>Your membership has been renewed successfully. Please find the receipt attached.</p>`,
      attachments: [
        {
          filename: "FitNexa_Receipt.pdf",
          path: receiptPath,
        },
      ],
    });

    // Optional cleanup
    fs.unlinkSync(receiptPath);
    console.log("✅ PDF receipt sent and cleaned up.");
  } catch (err) {
    console.error("❌ Error generating/sending receipt:", err);
  }
};

module.exports = generateAndSendReceipt;