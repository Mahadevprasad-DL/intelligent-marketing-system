import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, MapPin,  Sparkles, Shield, Zap, CheckCircle } from 'lucide-react';
import { industries, userTypes, leadSources, campaigns, budgetRanges, timeToBuy } from '../data/mockData';
import VideoModal from './VideoModal';
import Notification from './Notification';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    industry: '',
    country: '',
    state: '',
    city: '',
    userType: '',
    leadSource: '',
    campaign: '',
    marketingCampaignId: '',
    estimatedBudget: '',
    expectedTimeToBuy: ''
  });
  const [showVideo, setShowVideo] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });
  const navigate = useNavigate();

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      ...formData
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setIsLoading(false);
    showNotification('success', 'Registration Successful!', 'Your account has been created successfully. Please login to continue.');
    
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.fullName && formData.email  && formData.phoneNumber;
    }
    if (currentStep === 2) {
      return formData.industry && formData.country && formData.state && formData.city;
    }
    return formData.userType && formData.leadSource && formData.estimatedBudget && formData.expectedTimeToBuy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center neon-glow float-animation">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-900" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 gradient-text">
              Transform Your Marketing with AI
            </h1>
            <p className="text-xl text-gray-300 mb-2">Join the AI Marketing Revolution</p>
            <p className="text-gray-400">Create your account and unlock powerful AI tools</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-white/20 text-gray-400'
                    }`}>
                      {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                        currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <p className="text-white font-medium">
                  {currentStep === 1 && 'Personal Information'}
                  {currentStep === 2 && 'Location Details'}
                  {currentStep === 3 && 'Customer Journey'}
                </p>
                <p className="text-gray-400 text-sm">Step {currentStep} of 3</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                    <p className="text-gray-300">Let's start with your basic details</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-200 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    {/* <div className="relative group">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                        Strong Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                          placeholder="Create a strong password"
                        />
                      </div>
                    </div> */}

                    <div className="relative group">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <MapPin className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Location & Industry</h2>
                    <p className="text-gray-300">Help us understand your business context</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-200 mb-2">
                        Industry *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <select
                          id="industry"
                          name="industry"
                          required
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white backdrop-blur-sm appearance-none"
                        >
                          <option value="" className="bg-gray-800">Select your industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry} className="bg-gray-800">
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="relative group">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-200 mb-2">
                        Country *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          id="country"
                          name="country"
                          type="text"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-200 mb-2">
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter your state"
                      />
                    </div>

                    <div className="relative group">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-200 mb-2">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Customer Journey */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Customer Journey Fields</h2>
                    <p className="text-gray-300">Help us personalize your AI experience</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label htmlFor="userType" className="block text-sm font-medium text-gray-200 mb-2">
                        User Type *
                      </label>
                      <select
                        id="userType"
                        name="userType"
                        required
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-white backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-gray-800">Select user type</option>
                        {userTypes.map((type) => (
                          <option key={type} value={type} className="bg-gray-800">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative group">
                      <label htmlFor="leadSource" className="block text-sm font-medium text-gray-200 mb-2">
                        Lead Source *
                      </label>
                      <select
                        id="leadSource"
                        name="leadSource"
                        required
                        value={formData.leadSource}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-white backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-gray-800">Select lead source</option>
                        {leadSources.map((source) => (
                          <option key={source} value={source} className="bg-gray-800">
                            {source}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative group">
                      <label htmlFor="campaign" className="block text-sm font-medium text-gray-200 mb-2">
                        Campaign
                      </label>
                      <select
                        id="campaign"
                        name="campaign"
                        value={formData.campaign}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-white backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-gray-800">Select campaign</option>
                        {campaigns.map((campaign) => (
                          <option key={campaign} value={campaign} className="bg-gray-800">
                            {campaign}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative group">
                      <label htmlFor="marketingCampaignId" className="block text-sm font-medium text-gray-200 mb-2">
                        Marketing Campaign ID
                      </label>
                      <input
                        id="marketingCampaignId"
                        name="marketingCampaignId"
                        type="text"
                        value={formData.marketingCampaignId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Enter campaign ID (optional)"
                      />
                    </div>

                    <div className="relative group">
                      <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-200 mb-2">
                        Estimated Budget *
                      </label>
                      <select
                        id="estimatedBudget"
                        name="estimatedBudget"
                        required
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-white backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-gray-800">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range} className="bg-gray-800">
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative group">
                      <label htmlFor="expectedTimeToBuy" className="block text-sm font-medium text-gray-200 mb-2">
                        Expected Time to Buy *
                      </label>
                      <select
                        id="expectedTimeToBuy"
                        name="expectedTimeToBuy"
                        required
                        value={formData.expectedTimeToBuy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-white backdrop-blur-sm appearance-none"
                      >
                        <option value="" className="bg-gray-800">Select timeframe</option>
                        {timeToBuy.map((time) => (
                          <option key={time} value={time} className="bg-gray-800">
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    Previous Step
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 btn-animate disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || isLoading}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 btn-animate disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-3"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create AI Account'
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline">
                  Sign in here
                </Link>
              </p>
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

export default Register;