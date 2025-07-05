import React, { useState } from 'react';
import Navigation from './Navigation';
import {
  Megaphone, Mail, Share2, Target, PenTool, Zap, Plus, Download
} from 'lucide-react';
import { campaignTypes } from '../data/mockData';
import { generateCampaignContent } from '../lib/geminiCampaign'; // 

const Campaigns: React.FC = () => {
  const [selectedType, setSelectedType] = useState('');
  const [campaignDetails, setCampaignDetails] = useState({
    title: '',
    description: '',
    targetAudience: '',
    budget: '',
    duration: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const campaignIcons = {
    'Email Campaigns': Mail,
    'Social Media Posts': Share2,
    'PPC Ads': Target,
    'Content Marketing': PenTool,
    'Social Media Campaigns': Megaphone
  };

  const handleGenerateContent = async () => {
    if (!selectedType) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const result = await generateCampaignContent(selectedType, campaignDetails);
      setGeneratedContent(result);
    } catch (error) {
      setGeneratedContent('⚠️ Sorry, failed to generate campaign content. Try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCampaignDetails({
      ...campaignDetails,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="transition-all duration-300 lg:pl-80 lg:has-[.lg\\:w-20]:pl-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Campaign Generator</h1>
            <p className="text-gray-600">Create powerful marketing campaigns with artificial intelligence</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Campaign Setup */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Configuration</h2>

              {/* Campaign Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Campaign Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {campaignTypes.map((type) => {
                    const Icon = campaignIcons[type as keyof typeof campaignIcons];
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                          selectedType === type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Details Form */}
              <div className="space-y-4">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={campaignDetails.title}
                  onChange={handleInputChange}
                  placeholder="Campaign Title"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={campaignDetails.description}
                  onChange={handleInputChange}
                  placeholder="Campaign Description"
                  className="w-full px-4 py-3 border rounded-lg resize-none"
                />
                <input
                  id="targetAudience"
                  name="targetAudience"
                  type="text"
                  value={campaignDetails.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Target Audience"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  value={campaignDetails.budget}
                  onChange={handleInputChange}
                  placeholder="Budget"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={campaignDetails.duration}
                  onChange={handleInputChange}
                  placeholder="Campaign Duration"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <button
                onClick={handleGenerateContent}
                disabled={!selectedType || isGenerating}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate AI Campaign
                  </>
                )}
              </button>
            </div>

            {/* Generated Content */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Generated Content</h2>
                {generatedContent && (
                  <button className="flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                )}
              </div>

              <div className="min-h-[400px] border border-gray-200 rounded-lg p-4 bg-gray-50 whitespace-pre-wrap text-gray-800 leading-relaxed">
                {generatedContent || (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a campaign type and click "Generate AI Campaign" to see your content here</p>
                    </div>
                  </div>
                )}
              </div>

              {generatedContent && (
                <div className="mt-6 flex space-x-4">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Save Campaign
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Edit Content
                  </button>
                  <button
                    onClick={() => setGeneratedContent('')}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
