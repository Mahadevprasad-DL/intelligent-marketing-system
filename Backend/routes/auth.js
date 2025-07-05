import express from 'express';
import { generateOTP, sendOTP, storeOTP, verifyStoredOTP } from '../services/otpService.js';
const router = express.Router();

// Request OTP
router.post('/request-otp', async (req, res) => {
  // console.log('REQ BODY:', req.body);
  const { email } = req.body;
  console.log("Before auth request");

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const otp = generateOTP();
    await storeOTP(email, otp);
    // console.log("until here");
    await sendOTP(email, otp);

    res.json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const isValid = await verifyStoredOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Successful authentication
    res.json({ message: 'OTP verified successfully.', email });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Failed to verify OTP. Try again later.' });
  }
});

export default router;
