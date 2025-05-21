import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // Ensure port is a number
  secure: process.env.SMTP_SECURE === "true", // Convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 📧 Send Email Notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text message
 * @param {string} html - (Optional) HTML formatted email content
 */
const sendEmailNotification = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `"EKAANT TEAM" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html || text, // ✅ If HTML is provided, use it; otherwise, fallback to text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Sent Successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error Sending Email:", error.message);
  }
};

export default sendEmailNotification;