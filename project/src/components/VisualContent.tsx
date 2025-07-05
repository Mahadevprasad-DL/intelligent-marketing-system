import React, { useState } from 'react';
import Navigation from './Navigation';
import { Palette, Download, Share2, Eye, Wand2 } from 'lucide-react';

const VisualContent: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    brand: '',
    colors: '#3B82F6',
    style: 'modern'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const response = await fetch('https://api.bannerbear.com/v2/images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.REACT_APP_BANNERBEAR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: 'YOUR_TEMPLATE_UID', // replace with actual template UID
          modifications: [
            { name: 'title', text: formData.title },
            { name: 'subtitle', text: formData.subtitle },
            { name: 'description', text: formData.description },
            { name: 'brand', text: formData.brand }
          ]
        })
      });

      const data = await response.json();

      if (data.image_url) {
        setGeneratedContent(data.image_url);
      } else {
        console.error('Failed to generate content:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="transition-all duration-300 lg:pl-80 lg:has-[.lg\:w-20]:pl-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Content Creation</h1>
            <p className="text-gray-600">Create stunning marketing visuals with AI-powered design tools</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                    <input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="Enter main title" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input id="subtitle" name="subtitle" type="text" value={formData.subtitle} onChange={handleInputChange} placeholder="Enter subtitle" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} placeholder="Enter description or key message" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                  </div>
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                    <input id="brand" name="brand" type="text" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <input id="colors" name="colors" type="color" value={formData.colors} onChange={handleInputChange} className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
                    </div>
                    <div>
                      <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                      <select id="style" name="style" value={formData.style} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleGenerateContent} disabled={isGenerating} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Visual Content
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                  {generatedContent && (
                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Size
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
                <div className="min-h-[500px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating your visual content...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  ) : generatedContent ? (
                    <div className="text-center">
                      <img src={generatedContent} alt="Generated content" className="max-w-full max-h-96 rounded-lg shadow-lg mx-auto" />
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-medium">✨ Content generated successfully!</p>
                        <p className="text-green-600 text-sm mt-1">Your visual content is ready to use</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">Visual Content Preview</p>
                      <p className="text-gray-400 text-sm">Fill out the content details and click "Generate Visual Content" to see your creation here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualContent;
