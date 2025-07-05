import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Zap } from 'lucide-react';
import VideoModal from './VideoModal';
import Notification from './Notification';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [message] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const navigate = useNavigate();
  const email = localStorage.getItem('authEmail');

  const showNotification = (
    type: NotificationType,
    title: string,
    msg: string
  ) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message: msg
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`,
        { email, otp }
      );
      showNotification('success', 'OTP Verified', res.data.message);
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid OTP';
      showNotification('error', 'Verification Failed', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000" />
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 4 + 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Verification Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center neon-glow float-animation">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 gradient-text">
              Verify Your OTP
            </h1>
            <p className="text-xl text-gray-300 mb-2">Almost There!</p>
            <p className="text-gray-400">Enter the 6-digit code sent to your Email</p>
          </div>

          {/* OTP Form */}
          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl">
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <input
                type="text"
                placeholder="Enter 6‑digit OTP"
                className="w-full px-4 py-4 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm transition"
                value={otp}
                maxLength={6}
                required
                onChange={e => setOtp(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Verifying OTP...' : 'Verify & Continue'}
              </button>
            </form>

            {message && (
              <p className={`mt-4 text-center text-sm ${
                message.toLowerCase().includes('success') ? 'text-green-400' : 'text-yellow-300'
              }`}>
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-gray-300">
              Didn't receive it?{' '}
              <span
                onClick={() => navigate('/request-otp')}
                className="text-blue-300 hover:underline cursor-pointer"
              >
                Resend OTP
              </span>
            </p>
          </div>

          {/* Footer Branding */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-gray-400 text-sm mb-4">Trusted by 10,000+ marketers worldwide</p>
            <div className="flex justify-center opacity-60">
              <div className="w-18 h-13 bg-white/20 rounded-lg overflow-hidden">
                <img src="img/Untitled.png" alt="Brand logo" className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Notification */}
      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default VerifyOTP;
