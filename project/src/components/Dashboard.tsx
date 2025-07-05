import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import {
  Clock, MapPin, TrendingUp, Star, ArrowRight, Sparkles, Zap,
  Users, BarChart3, Palette
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('Loading...');
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [localTrends, setLocalTrends] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 2000);

  const getLocation = () => {
    return new Promise<{ city: string }>((resolve, reject) => {
      if (!navigator.geolocation) return reject('Geolocation not supported');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
            );
            const data = await response.json();
            const components = data?.results?.[0]?.components;

            const city =
              components?.city ||
              components?.town ||
              components?.village ||
              components?.state_district ||
              components?.county ||
              components?.state;

            if (city) resolve({ city });
            else reject('City not found');
          } catch (error) {
            reject('Failed to fetch location');
          }
        },
        (err) => reject('Location access denied: ' + err.message)
      );
    });
  };

  const fetchLocationAndGeminiData = async () => {
  let resolvedCity = '';
  try {
    const { city } = await getLocation();
    setLocation(city);         // Show it immediately
    resolvedCity = city;       // Save it for Gemini
  } catch (err) {
    setLocation(typeof err === 'string' ? err : 'Location fetch failed');
    setLoadingData(false);
    return; // stop here, no Gemini call
  }

  try {
    const geminiPrompt = `
You are an AI marketing assistant.

1. Recommend 6 trending products available in ${resolvedCity}, India. Each product should include:
- name
- category

Format it as a JSON array like this:
[
  {
    "name": "Product A",
    "category": "Electronics"
  }
]

2. Then provide 6 upcoming marketing trends in ${resolvedCity}, India as a JSON array of strings.
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }]
        })
      }
    );

     const geminiData = await geminiRes.json();
        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('Gemini Raw Response:', rawText);

        const productMatch = rawText.match(/\[\s*{[\s\S]*?}\s*]/);
        const trendMatch = rawText.match(/\[[\s\S]*?\]/g)?.[1]; // second array

        if (productMatch && trendMatch) {
          const parsedProducts = JSON.parse(productMatch[0]);
          const parsedTrends = JSON.parse(trendMatch);
          setRecommendedProducts(parsedProducts);
          setLocalTrends(parsedTrends);
        } else {
          console.error('Failed to parse Gemini response.');
        }
      } catch (err) {
        console.error('Gemini error:', err);
      } finally {
        setLoadingData(false);
      }
};


  fetchLocationAndGeminiData();

  return () => clearInterval(timer);
}, []);


  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const quickActions = [
    {
      icon: TrendingUp,
      title: 'Create Campaign',
      desc: 'AI-powered marketing campaigns',
      color: 'blue',
      path: '/campaigns',
      onClick: () => navigate('/campaigns')
    },
    {
      icon: BarChart3,
      title: 'View Analytics',
      desc: 'Performance insights & metrics',
      color: 'green',
      path: '/analytics',
      onClick: () => navigate('/analytics')
    },
    {
      icon: Users,
      title: 'Customer Journey',
      desc: 'Track user interactions',
      color: 'purple',
      path: '/customer-journey',
      onClick: () => navigate('/customer-journey')
    },
    {
      icon: Palette,
      title: 'AI Marketing Assistant',
      desc: 'Get instant marketing advice and strategies powered by AI',
      color: 'pink',
      path: '/ai-chat',
      onClick: () => navigate('/ai-chat')
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="transition-all duration-300 lg:pl-80 lg:has-[.lg\\:w-20]:pl-20">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Welcome back, {currentUser.fullName || 'User'}!
                </h1>
                <p className="text-gray-600 text-lg">Ready to transform your marketing with AI?</p>
              </div>
            </div>
          </div>

          {/* Real-Time Data */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 grid md:grid-cols-3 gap-8">
              <div className="flex items-center space-x-4 group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Your Location</h3>
                  <p className="text-blue-100">{location}</p>
                  <p className="text-xs text-blue-200 mt-1">Real-time tracking</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Current Time</h3>
                  <p className="text-blue-100">{format(currentTime, 'PPpp')}</p>
                  <p className="text-xs text-blue-200 mt-1">Live updates</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Active Campaigns</h3>
                  <p className="text-blue-100">5 Running</p>
                  <p className="text-xs text-blue-200 mt-1">Performance tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Recommendations & Trends */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Top Products in {location}</h2>
                  <p className="text-gray-600">Local market leaders & bestsellers</p>
                </div>
              </div>

              {loadingData ? (
                <p className="text-gray-400">Loading product recommendations...</p>
              ) : (
                <div className="space-y-4">
                  {recommendedProducts.map((product, index) => (
  <div key={index} className="flex items-center p-4 rounded-2xl border hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group">
    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
      {index + 1}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
    </div>
  </div>
))}

                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Marketing Trends in {location}</h2>
                  <p className="text-gray-600">Latest regional insights</p>
                </div>
              </div>

              {loadingData ? (
                <p className="text-gray-400">Loading trends...</p>
              ) : (
                <div className="space-y-4">
                  {localTrends.map((trend, index) => (
                    <div key={index} className="flex items-center p-4 rounded-2xl border hover:border-green-200 hover:bg-green-50/50 transition-all duration-200 group cursor-pointer">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{trend}</h3>
                        <p className="text-sm text-gray-500">High-impact trend</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Zap className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colorClasses = {
                  blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                  green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                  purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
                  pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
                };
                return (
                  <div key={index} onClick={action.onClick}
                    className="bg-white rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all cursor-pointer group card-hover"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-r ${colorClasses[action.color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{action.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{action.desc}</p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
