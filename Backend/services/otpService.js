import redis from '../redisClient.js';
import { sendOtpEmail } from './mailer.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = async (email, otp) => {
  await redis.set(`otp:${email}`, otp, 'EX', 300); 
};

export const sendOTP = async (email, otp) => {
  await sendOtpEmail(email, otp);

};

export const verifyStoredOTP = async (email, otp) => {
  const stored = await redis.get(`otp:${email}`);
  if (stored === otp) {
    await redis.del(`otp:${email}`);
    return true;
  }
  return false;
};
