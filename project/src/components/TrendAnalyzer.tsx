import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import {
  TrendingUp, Search, Globe,
  BarChart3,  Target, Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import {  Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Trend {
  id: string;
  keyword: string;
  platform: string;
  volume: number;
  growth: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  region: string;
  hashtags: string[];
  description: string;
  relevanceScore: number;
}

const TrendAnalyzer: React.FC = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [filteredTrends, setFilteredTrends] = useState<Trend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const platforms = ['Twitter', 'Instagram', 'Reddit', 'YouTube', 'TikTok', 'LinkedIn', 'Facebook'];
  const categories = ['Technology', 'Marketing', 'Business', 'Entertainment', 'Health', 'Finance', 'Education', 'Sports'];
  const regions = ['Global', 'North America', 'Europe', 'Asia', 'India', 'Others'];

  useEffect(() => {
    generateMockTrends();
  }, []);

  useEffect(() => {
    filterTrends();
  }, [trends, searchTerm, selectedPlatform, selectedCategory, selectedRegion]);

  const generateMockTrends = () => {
    const mockTrends: Trend[] = [
      {
        id: '1',
        keyword: 'AI Marketing Automation',
        platform: 'LinkedIn',
        volume: 125000,
        growth: 45.2,
        sentiment: 'positive',
        category: 'Marketing',
        region: 'Global',
        hashtags: ['#AIMarketing', '#Automation', '#DigitalTransformation'],
        description: 'Growing interest in AI-powered marketing automation tools and strategies',
        relevanceScore: 95
      },
      {
        id: '2',
        keyword: 'Sustainable Business',
        platform: 'Twitter',
        volume: 89000,
        growth: 32.1,
        sentiment: 'positive',
        category: 'Business',
        region: 'Europe',
        hashtags: ['#Sustainability', '#GreenBusiness', '#ESG'],
        description: 'Increasing focus on sustainable business practices and environmental responsibility',
        relevanceScore: 88
      },
      {
        id: '3',
        keyword: 'Remote Work Tools',
        platform: 'Reddit',
        volume: 67000,
        growth: 28.7,
        sentiment: 'neutral',
        category: 'Technology',
        region: 'North America',
        hashtags: ['#RemoteWork', '#Productivity', '#WorkFromHome'],
        description: 'Discussion around new tools and technologies for remote work efficiency',
        relevanceScore: 82
      },
      {
        id: '4',
        keyword: 'Influencer Marketing ROI',
        platform: 'Instagram',
        volume: 156000,
        growth: 52.3,
        sentiment: 'positive',
        category: 'Marketing',
        region: 'Global',
        hashtags: ['#InfluencerMarketing', '#ROI', '#SocialMedia'],
        description: 'Brands focusing on measuring and improving influencer marketing return on investment',
        relevanceScore: 91
      },
      {
        id: '5',
        keyword: 'Cryptocurrency Adoption',
        platform: 'YouTube',
        volume: 234000,
        growth: 67.8,
        sentiment: 'positive',
        category: 'Finance',
        region: 'Asia',
        hashtags: ['#Crypto', '#Blockchain', '#DigitalCurrency'],
        description: 'Rising adoption of cryptocurrency in mainstream business and finance',
        relevanceScore: 85
      },
      {
        id: '6',
        keyword: 'Mental Health Awareness',
        platform: 'TikTok',
        volume: 189000,
        growth: 41.5,
        sentiment: 'positive',
        category: 'Health',
        region: 'Global',
        hashtags: ['#MentalHealth', '#Wellness', '#SelfCare'],
        description: 'Growing conversation around mental health awareness and workplace wellness',
        relevanceScore: 79
      },
      {
        id: '7',
        keyword: 'E-commerce Personalization',
        platform: 'LinkedIn',
        volume: 78000,
        growth: 35.9,
        sentiment: 'positive',
        category: 'Technology',
        region: 'India',
        hashtags: ['#Ecommerce', '#Personalization', '#CustomerExperience'],
        description: 'Focus on personalized shopping experiences and AI-driven recommendations',
        relevanceScore: 87
      },
      {
        id: '8',
        keyword: 'Video Marketing Trends',
        platform: 'Facebook',
        volume: 145000,
        growth: 48.2,
        sentiment: 'positive',
        category: 'Marketing',
        region: 'North America',
        hashtags: ['#VideoMarketing', '#ContentCreation', '#DigitalMarketing'],
        description: 'Evolution of video marketing strategies and short-form content trends',
        relevanceScore: 93
      }
    ];
    setTrends(mockTrends);
  };

  const filterTrends = () => {
    let filtered = trends;

    if (searchTerm) {
      filtered = filtered.filter(trend =>
        trend.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trend.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trend.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(trend => trend.platform === selectedPlatform);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(trend => trend.category === selectedCategory);
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(trend => trend.region === selectedRegion);
    }

    setFilteredTrends(filtered);
  };

  const analyzeTrends = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    generateMockTrends();
    setIsAnalyzing(false);
  };

  // Chart data
  const trendVolumeData = {
    labels: filteredTrends.map(t => t.keyword.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: 'Search Volume',
      data: filteredTrends.map(t => t.volume),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }]
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [
        filteredTrends.filter(t => t.sentiment === 'positive').length,
        filteredTrends.filter(t => t.sentiment === 'neutral').length,
        filteredTrends.filter(t => t.sentiment === 'negative').length,
      ],
      backgroundColor: ['#10B981', '#6B7280', '#EF4444'],
      borderWidth: 2,
      borderColor: 'white'
    }]
  };

  const platformData = {
    labels: platforms,
    datasets: [{
      label: 'Trends by Platform',
      data: platforms.map(platform => 
        filteredTrends.filter(t => t.platform === platform).length
      ),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#06B6D4', '#84CC16'
      ],
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:pl-80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Trend Analyzer</h1>
          <p className="text-gray-600 mb-6">Real‑time analysis of trending topics, hashtags, and sentiment across platforms</p>

          {/* Control Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Trend Analysis Controls</h2>
              <button
                onClick={analyzeTrends}
                disabled={isAnalyzing}
              >
              </button>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search trends, keywords, hashtags..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Volume Analysis</h3>
              <div className="h-64">
                <Bar data={trendVolumeData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
              <div className="h-64">
                <Doughnut data={sentimentData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p=6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
              <div className="h-64">
                <Bar data={platformData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Trends</h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{filteredTrends.length}</p>
              <p className="text-sm text-blue-600">Active trends</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg Growth</h3>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold">
                {filteredTrends.length
                  ? Math.round(filteredTrends.reduce((a, t) => a + t.growth, 0) / filteredTrends.length)
                  : 0}%  
              </p>
              <p className="text-sm text-green-600">Growth rate</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Top Platform</h3>
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">
                {platforms.reduce((a, b) =>
                  filteredTrends.filter(t => t.platform === a).length >
                  filteredTrends.filter(t => t.platform === b).length
                    ? a : b
                )}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg Relevance</h3>
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold">
                {filteredTrends.length
                  ? Math.round(filteredTrends.reduce((a, t) => a + t.relevanceScore, 0) / filteredTrends.length)
                  : 0}%
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center mb-6">
              <Sparkles className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Market Opportunities</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• AI Marketing Automation shows ~45% growth</li>
                  <li>• Video Marketing trends up ~48%</li>
                  <li>• Influencer Marketing ROI gaining traction</li>
                  <li>• E-commerce Personalization rising in India</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Publish LinkedIn content on AI Marketing</li>
                  <li>• Create video campaigns on Facebook & YouTube</li>
                  <li>• Roll out sustainability messaging in Europe</li>
                  <li>• Explore crypto-related opportunities in Asia</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrendAnalyzer;
