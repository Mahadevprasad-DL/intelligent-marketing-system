import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from one level above
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use a custom SMTP host
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS  // your email password or app password
  }
});



export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"AI Platform" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your OTP for AI Platform Login',
    html: `
    <div style="font-family:sans-serif; padding:20px;">
        <h2>🔐 One-Time Password</h2>
        <p>Hello,</p>
        <p>Your OTP code is:</p>
        <h1 style="color:#4F46E5">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <br/>
        <p>— AI Platform Team</p>
        </div>
        `
      };
  await transporter.sendMail(mailOptions);
};
