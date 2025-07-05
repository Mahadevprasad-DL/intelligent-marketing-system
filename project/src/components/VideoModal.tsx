import React, { useState, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Square, Star, Users, TrendingUp, Zap } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Transform Your Marketing with AI</h3>
            <p className="text-gray-300">See how AI revolutionizes marketing strategies</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/10">
            {/* Video Placeholder - You can replace this with an actual video element */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
            
            {/* For actual video implementation, replace the placeholder with: */}
            { 
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls={false}
              poster="/path-to-your-video-thumbnail.jpg"
            >
              <source src="public/Untitled_Project.mp4" type="video/mp4" />
              <source src="public/Untitled_Project.mp4" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            
            }
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto hover:bg-white/30 transition-all cursor-pointer group">
                <Play className="w-12 h-12 text-white ml-1 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">AI Marketing Demo</h4>
              <p className="text-gray-300">Experience the future of marketing automation</p>
              
              {/* Video Information */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                <h5 className="text-white font-semibold mb-2">📹 Video Information</h5>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><strong>File Location:</strong> src/components/VideoModal.tsx</p>
                  <p><strong>To add your video:</strong></p>
                  <ol className="list-decimal list-inside text-xs space-y-1 mt-2">
                    <li>Place your video file in the public folder (e.g., public/demo-video.mp4)</li>
                    <li>Replace the placeholder div with a video element</li>
                    <li>Set the src attribute to "/demo-video.mp4"</li>
                    <li>Add poster image for thumbnail</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 float-animation">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 float-animation" style={{ animationDelay: '1s' }}>
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute bottom-20 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 float-animation" style={{ animationDelay: '2s' }}>
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div className="absolute bottom-20 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 float-animation" style={{ animationDelay: '3s' }}>
              <Star className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          {/* Video Controls */}
          <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleSkipBack}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
              >
                <SkipBack className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>
              
              <button
                onClick={handleStop}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
              >
                <Square className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={handleSkipForward}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
              >
                <SkipForward className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Key Features Covered
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  AI-powered campaign generation and optimization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Advanced customer journey tracking and analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Real-time performance dashboard and insights
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Visual content creation with AI assistance
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Intelligent product recommendations
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-400" />
                What You'll Learn
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  How to set up AI-driven marketing campaigns
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  Best practices for customer segmentation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Maximizing ROI with data-driven insights
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  Creating compelling visual content at scale
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                  Leveraging AI for competitive advantage
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-lg font-semibold text-white mb-1">Ready to Get Started?</h5>
                <p className="text-gray-300">Join thousands of marketers already using AI</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">300%</div>
                  <div className="text-sm text-gray-400">Avg ROI Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-gray-400">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;