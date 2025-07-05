import React, { useState, useRef, useEffect } from 'react';
import Navigation from './Navigation';
import { Send, Bot, User, Sparkles, Lightbulb, TrendingUp, Target } from 'lucide-react';
import { getGeminiResponse } from '../lib/gemini'; // Adjust path if needed

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your AI Marketing Assistant. I can help you with campaign strategies, audience targeting, content ideas, and marketing analytics. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    { icon: TrendingUp, text: "What are the current marketing trends?" },
    { icon: Target, text: "How can I improve my ad targeting?" },
    { icon: Lightbulb, text: "Give me content ideas for social media" },
    { icon: Sparkles, text: "How to increase email open rates?" }
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiReply = await getGeminiResponse(inputText);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Sorry, I couldn't get a response from the AI. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question: React.SetStateAction<string>) => {
    setInputText(question);
  };

  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="transition-all duration-300 lg:pl-80 lg:has-[.lg\\:w-20]:pl-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Marketing Assistant</h1>
            <p className="text-gray-600">Get instant marketing advice and strategies powered by AI</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="border-t p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick questions to get started:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => {
                  const Icon = question.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question.text)}
                      className="flex items-center p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-2 text-blue-600" />
                      {question.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about marketing..."
                  rows={2}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Campaign Ideas</h3>
              <p className="text-gray-600 text-sm">Get creative campaign concepts tailored to your industry and goals</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Audience Insights</h3>
              <p className="text-gray-600 text-sm">Discover new audience segments and targeting opportunities</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance Tips</h3>
              <p className="text-gray-600 text-sm">Learn optimization strategies to improve your marketing ROI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
