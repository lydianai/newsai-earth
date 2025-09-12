'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, Globe, Send, Settings, Crown, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'ai-host' | 'system';
  language: string;
  translation?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  isVIP?: boolean;
  reactions?: Record<string, number>;
}

interface LiveTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  participants: number;
  language: string;
  trending_score: number;
  created_at: string;
  ai_host_active: boolean;
}

interface User {
  id: string;
  username: string;
  avatar?: string;
  isVIP: boolean;
  language: string;
  country: string;
}

export default function GlobalLiveDiscourse() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_1',
    username: 'Global_Citizen',
    isVIP: false,
    language: 'en',
    country: 'TR'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [liveTopics, setLiveTopics] = useState<LiveTopic[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const [activeVoice, setActiveVoice] = useState(false);
  const [activeVideo, setActiveVideo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showTranslations, setShowTranslations] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleTopics: LiveTopic[] = [
      {
        id: 'topic_1',
        title: 'Global Climate Action Summit 2025',
        description: 'Discussing live updates and outcomes from the Istanbul Climate Summit',
        category: 'Environment',
        participants: 2847,
        language: 'multi',
        trending_score: 9.8,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ai_host_active: true
      },
      {
        id: 'topic_2',
        title: 'Breakthrough in Quantum-AI Technology',
        description: 'Live discussion on the revolutionary quantum-classical computing hybrid',
        category: 'Technology',
        participants: 1893,
        language: 'multi',
        trending_score: 9.2,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        ai_host_active: true
      },
      {
        id: 'topic_3',
        title: 'Global Economic Outlook 2025',
        description: 'Markets, inflation, and the future of digital currencies',
        category: 'Economics',
        participants: 1567,
        language: 'multi',
        trending_score: 8.7,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        ai_host_active: false
      },
      {
        id: 'topic_4',
        title: 'Türkiye Teknoloji Zirvesi',
        description: 'Türkiye\'nin teknoloji geleceği hakkında canlı sohbet',
        category: 'Technology',
        participants: 934,
        language: 'tr',
        trending_score: 8.1,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        ai_host_active: true
      },
      {
        id: 'topic_5',
        title: 'Space Exploration: Mars Mission Updates',
        description: 'Latest developments in space technology and Mars colonization',
        category: 'Science',
        participants: 1245,
        language: 'multi',
        trending_score: 7.9,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        ai_host_active: true
      }
    ];

    setLiveTopics(sampleTopics);
    setSelectedTopic('topic_1');

    // Sample messages for the first topic
    const sampleMessages: ChatMessage[] = [
      {
        id: 'msg_1',
        username: 'AI-Host-ARIA',
        message: 'Welcome to our Global Climate Action Summit discussion! I\'m ARIA, your AI co-host. Let\'s explore the latest developments together.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'ai-host',
        language: 'en',
        sentiment: 'positive'
      },
      {
        id: 'msg_2',
        username: 'EcoWarrior_Istanbul',
        message: 'Amazing to see Turkey leading the climate summit! The renewable energy announcements are groundbreaking.',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: 'user',
        language: 'en',
        translation: 'Türkiye\'nin iklim zirvesine öncülük etmesi harika! Yenilenebilir enerji açıklamaları çığır açıyor.',
        sentiment: 'positive',
        reactions: { '👏': 15, '🌱': 8, '🇹🇷': 12 }
      },
      {
        id: 'msg_3',
        username: 'ClimateScientist_Dr_Sarah',
        message: 'The carbon neutrality commitments by 2030 are ambitious but achievable with current technology advances.',
        timestamp: new Date(Date.now() - 6 * 60 * 1000),
        type: 'user',
        language: 'en',
        sentiment: 'positive',
        isVIP: true,
        reactions: { '✅': 23, '🔬': 7 }
      },
      {
        id: 'msg_4',
        username: 'Mehmet_Ankara',
        message: 'Bu zirvede Türkiye\'nin aldığı roller gerçekten gurur verici. Dünya için önemli adımlar atılıyor.',
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
        type: 'user',
        language: 'tr',
        translation: 'The roles Turkey has taken in this summit are truly prideful. Important steps are being taken for the world.',
        sentiment: 'positive',
        reactions: { '🇹🇷': 18, '👍': 12 }
      },
      {
        id: 'msg_5',
        username: 'AI-Host-ARIA',
        message: 'Great insights everyone! @ClimateScientist_Dr_Sarah, can you elaborate on which specific technologies are most promising for achieving these targets?',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'ai-host',
        language: 'en',
        sentiment: 'neutral'
      }
    ];

    setMessages(sampleMessages);

    // Simulate real-time user count updates
    const userCountInterval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 15000);

    return () => clearInterval(userCountInterval);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTopic) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      username: currentUser.username,
      message: newMessage,
      timestamp: new Date(),
      type: 'user',
      language: selectedLanguage,
      sentiment: 'neutral'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate AI host response (30% chance)
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: `ai_${Date.now()}`,
          username: 'AI-Host-ARIA',
          message: generateAIResponse(newMessage),
          timestamp: new Date(),
          type: 'ai-host',
          language: 'en',
          sentiment: 'positive'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000 + Math.random() * 3000);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      `Interesting perspective! The point about "${userMessage.substring(0, 30)}..." brings up important considerations for global cooperation.`,
      `Thank you for sharing that insight. This connects well with the sustainable development goals we're discussing.`,
      `Great question! This topic requires input from multiple stakeholders across different regions and sectors.`,
      `That's a valuable observation. Let's explore how this might impact developing nations differently.`,
      `Excellent point! This aligns with the latest research findings from the IPCC reports.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const joinTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    setMessages([]); // Clear messages when switching topics
    
    // Simulate loading messages for new topic
    setTimeout(() => {
      const topic = liveTopics.find(t => t.id === topicId);
      if (topic) {
        const welcomeMessage: ChatMessage = {
          id: `welcome_${Date.now()}`,
          username: 'AI-Host-ARIA',
          message: `Welcome to "${topic.title}"! I'm here to facilitate our discussion and provide insights.`,
          timestamp: new Date(),
          type: 'ai-host',
          language: 'en',
          sentiment: 'positive'
        };
        setMessages([welcomeMessage]);
      }
    }, 1000);
  };

  const toggleVoice = () => {
    setActiveVoice(!activeVoice);
    // In a real implementation, this would start/stop voice chat
  };

  const toggleVideo = () => {
    setActiveVideo(!activeVideo);
    // In a real implementation, this would start/stop video chat
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const categories = ['All', 'Environment', 'Technology', 'Economics', 'Science', 'Politics', 'Health', 'Culture'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">Global Live Discourse</h1>
                <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                  LIVE
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-slate-300">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{onlineUsers.toLocaleString()} online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{liveTopics.reduce((sum, topic) => sum + topic.participants, 0).toLocaleString()} in discussions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              {currentUser.isVIP && (
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-sm font-bold rounded-full flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>VIP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Topics Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Live Topics</h2>
              
              {/* Category Filter */}
              <div className="mb-4">
                <select className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm">
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {liveTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => joinTopic(topic.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedTopic === topic.id
                        ? 'bg-blue-600/30 border-blue-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-slate-600/50 text-slate-300 rounded-full">
                        {topic.category}
                      </span>
                      {topic.ai_host_active && (
                        <div className="flex items-center space-x-1 text-xs text-cyan-400">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <span>AI Host</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{topic.participants.toLocaleString()} participants</span>
                      <div className="flex items-center space-x-1">
                        <span>🔥</span>
                        <span>{topic.trending_score}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-6">
            {selectedTopic ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-white">
                        {liveTopics.find(t => t.id === selectedTopic)?.title}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {liveTopics.find(t => t.id === selectedTopic)?.participants.toLocaleString()} participants
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleVoice}
                        className={`p-2 rounded-lg transition-colors ${
                          activeVoice 
                            ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                            : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50'
                        }`}
                      >
                        {activeVoice ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={toggleVideo}
                        className={`p-2 rounded-lg transition-colors ${
                          activeVideo 
                            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                            : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50'
                        }`}
                      >
                        {activeVideo ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  ref={chatContainerRef}
                  className="h-96 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === 'user' && message.username === currentUser.username 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[80%] ${
                        message.type === 'ai-host' 
                          ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30'
                          : message.username === currentUser.username
                            ? 'bg-blue-600/20 border border-blue-500/30'
                            : 'bg-slate-700/50 border border-slate-600/30'
                      } rounded-lg p-3`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              message.type === 'ai-host' 
                                ? 'text-cyan-400'
                                : message.isVIP 
                                  ? 'text-yellow-400'
                                  : 'text-slate-300'
                            }`}>
                              {message.username}
                              {message.isVIP && <Crown className="w-3 h-3 inline ml-1 text-yellow-400" />}
                              {message.type === 'ai-host' && <span className="ml-1 text-xs bg-cyan-500/20 px-1 rounded">AI</span>}
                            </span>
                            <span className="text-xs text-slate-500">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-white mb-2">{message.message}</p>
                        
                        {showTranslations && message.translation && message.language !== selectedLanguage && (
                          <p className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-2 mb-2">
                            Translation: {message.translation}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {message.reactions && Object.entries(message.reactions).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(message.id, emoji)}
                                className="flex items-center space-x-1 text-xs bg-slate-600/50 hover:bg-slate-600/70 rounded-full px-2 py-1 transition-colors"
                              >
                                <span>{emoji}</span>
                                <span className="text-slate-300">{count}</span>
                              </button>
                            ))}
                            <button
                              onClick={() => addReaction(message.id, '👍')}
                              className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-slate-500 text-xs">
                              {message.language.toUpperCase()}
                            </span>
                            {message.sentiment && (
                              <span className={`w-2 h-2 rounded-full ${
                                message.sentiment === 'positive' ? 'bg-green-400' :
                                message.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                              }`}></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500/50 focus:outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Messages are automatically translated. Respectful discourse encouraged.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 text-center">
                <MessageCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Select a Topic</h2>
                <p className="text-slate-400">Choose a live discussion topic from the sidebar to start participating</p>
              </div>
            )}
          </div>

          {/* Live Activity Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* Online Users */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
                <h3 className="font-semibold text-white mb-3">Online Now</h3>
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {onlineUsers.toLocaleString()}
                </div>
                <p className="text-sm text-slate-400">users worldwide</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">🇺🇸 English</span>
                    <span className="text-white">{Math.floor(onlineUsers * 0.4)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">🇹🇷 Türkçe</span>
                    <span className="text-white">{Math.floor(onlineUsers * 0.15)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">🇪🇸 Español</span>
                    <span className="text-white">{Math.floor(onlineUsers * 0.12)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">🇫🇷 Français</span>
                    <span className="text-white">{Math.floor(onlineUsers * 0.08)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">🌍 Others</span>
                    <span className="text-white">{Math.floor(onlineUsers * 0.25)}</span>
                  </div>
                </div>
              </div>

              {/* Trending Now */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
                <h3 className="font-semibold text-white mb-3">Trending Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '#ClimateAction', '#QuantumAI', '#Innovation', '#Sustainability',
                    '#Technology', '#GlobalEconomy', '#SpaceExploration', '#DigitalFuture'
                  ].map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-xs text-blue-300 hover:bg-blue-600/30 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Host Status */}
              <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-cyan-400">AI Host Active</h3>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  ARIA is facilitating discussions and providing real-time insights across multiple topics.
                </p>
                <div className="text-xs text-slate-400">
                  <div>Languages: Multi-lingual support</div>
                  <div>Sentiment Analysis: Active</div>
                  <div>Fact Checking: Enabled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Discourse Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Show Translations
                </label>
                <button
                  onClick={() => setShowTranslations(!showTranslations)}
                  className={`relative inline-flex w-11 h-6 items-center rounded-full transition-colors ${
                    showTranslations ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${
                    showTranslations ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser(prev => ({...prev, username: e.target.value}))}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
