import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Sparkles, Zap, TrendingUp, Target } from 'lucide-react';
import VideoModal from './VideoModal';
import Notification from './Notification';

// Define a type for the notification
type NotificationType = 'success' | 'error' | 'warning' | 'info';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

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


  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRedirectToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/request-otp?name=${encodeURIComponent(formData.name)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
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

      {/* Main Login Card */}
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
              Transform Your Marketing with AI
            </h1>
            <p className="text-xl text-gray-300 mb-2">Welcome to the Future of Marketing</p>
            <p className="text-gray-400">Sign in to unlock AI-powered marketing solutions</p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center card-hover">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">AI Analytics</p>
              <p className="text-gray-300 text-xs">Real-time insights</p>
            </div>
            <div className="glass rounded-xl p-4 text-center card-hover">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Smart Targeting</p>
              <p className="text-gray-300 text-xs">Precision campaigns</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl">
            <form className="space-y-6" onSubmit={handleRedirectToOtp}>
              <div className="space-y-4">
                <div className="relative group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Continue to OTP
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:underline">
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">Trusted by 10,000+ marketers worldwide</p>
              </div>
              <div className="flex justify-center space-x-6 opacity-60">
                <div className="w-18 h-13 bg-white/20 rounded-lg overflow-hidden">
                  <img loading="lazy" src="img/Untitled.webp" alt="Brand 1" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Login;
