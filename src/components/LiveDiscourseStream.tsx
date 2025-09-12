'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Zap, ChevronDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DiscourseMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'user' | 'ai-host';
  language: string;
  isVIP?: boolean;
}

interface DiscourseStats {
  activeUsers: number;
  activeTopics: number;
  messagesPerMinute: number;
}

export default function LiveDiscourseStream() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<DiscourseMessage[]>([]);
  const [stats, setStats] = useState<DiscourseStats>({
    activeUsers: 1247,
    activeTopics: 8,
    messagesPerMinute: 42
  });

  // Simulate live messages
  useEffect(() => {
    const sampleMessages = [
      {
        id: '1',
        username: 'AI-Host-ARIA',
        message: 'İklim Zirvesi 2025 hakkında ne düşünüyorsunuz? Türkiye\'nin liderlik rolü oldukça etkileyici.',
        timestamp: new Date().toISOString(),
        type: 'ai-host' as const,
        language: 'tr'
      },
      {
        id: '2', 
        username: 'EkolojistMehmet',
        message: 'Gerçekten tarihi bir an! Yenilenebilir enerji hedefleri çok iddialı.',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        type: 'user' as const,
        language: 'tr'
      },
      {
        id: '3',
        username: 'TechGuru_Istanbul',
        message: 'Kuantum bilgisayar geliştirmelerinden haberdar olan var mı? 1000x hız artışı inanılmaz!',
        timestamp: new Date(Date.now() - 60000).toISOString(), 
        type: 'user' as const,
        language: 'tr',
        isVIP: true
      },
      {
        id: '4',
        username: 'AI-Host-ARIA',
        message: 'Kuantum-AI hibrit sistemler konusunda yeni araştırmalar çok umut verici.',
        timestamp: new Date(Date.now() - 90000).toISOString(),
        type: 'ai-host' as const,
        language: 'tr'
      },
      {
        id: '5',
        username: 'GeleceğinMühendisi',
        message: 'Digital Twin teknolojisi sayesinde çevresel değişimleri gerçek zamanlı takip edebiliyoruz.',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'user' as const,
        language: 'tr'
      },
      {
        id: '6',
        username: 'ArtificialMind',
        message: 'Yapay zeka tarımda devrim yapıyor. Verim artışı %40\'a ulaştı!',
        timestamp: new Date(Date.now() - 150000).toISOString(),
        type: 'user' as const,
        language: 'tr'
      }
    ];

    setMessages(sampleMessages);

    // Update stats periodically
    const interval = setInterval(() => {
      setStats({
        activeUsers: Math.floor(1200 + Math.random() * 100),
        activeTopics: Math.floor(6 + Math.random() * 4),
        messagesPerMinute: Math.floor(35 + Math.random() * 15)
      });

      // Add new message occasionally
      if (Math.random() < 0.3) {
        const newMessages = [
          'Teknolojik gelişmeler gerçekten hızlanıyor!',
          'Bu platformu çok beğendim, harika bir deneyim.',
          'AI modüllerinin hepsi çok gelişmiş.',
          'Global söyleşi çok faydalı oluyor.',
          'Türkiye\'nin teknoloji lideri olması gurur verici.',
          'Sürdürülebilir gelecek için hep birlikte çalışmalıyız.'
        ];

        const usernames = [
          'TeknolojiSevdalısı', 'YeşilGelecek', 'AIUzmanı', 'İnovasyonCu',
          'DigitalNomad', 'FutureBuilder', 'SmartCityFan', 'EcoWarrior'
        ];

        const newMessage: DiscourseMessage = {
          id: `msg_${Date.now()}`,
          username: usernames[Math.floor(Math.random() * usernames.length)],
          message: newMessages[Math.floor(Math.random() * newMessages.length)],
          timestamp: new Date().toISOString(),
          type: 'user',
          language: 'tr',
          isVIP: Math.random() < 0.3
        };

        setMessages(prev => [newMessage, ...prev.slice(0, 5)]);
      }
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}dk`;
    return `${Math.floor(diff / 3600)}sa`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40"
    >
      <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageCircle className="w-6 h-6 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Canlı Söyleşi</h3>
              <p className="text-slate-400 text-xs">AI-Host Aktif</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Live Stats */}
            <div className="flex items-center space-x-1 text-xs">
              <Users className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-bold">{stats.activeUsers}</span>
            </div>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Stats Bar */}
              <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400">CANLI</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400">{stats.activeTopics} konu</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400">{stats.messagesPerMinute}/dk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors ${
                      message.type === 'ai-host' ? 'bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        message.type === 'ai-host' 
                          ? 'bg-purple-400 animate-pulse' 
                          : message.isVIP 
                            ? 'bg-yellow-400' 
                            : 'bg-green-400'
                      }`}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-medium truncate ${
                              message.type === 'ai-host'
                                ? 'text-purple-300'
                                : message.isVIP
                                  ? 'text-yellow-300'
                                  : 'text-blue-300'
                            }`}>
                              {message.username}
                            </span>
                            
                            {message.type === 'ai-host' && (
                              <span className="px-1.5 py-0.5 bg-purple-600/30 text-purple-300 text-xs font-bold rounded-full">
                                AI
                              </span>
                            )}
                            
                            {message.isVIP && (
                              <span className="px-1.5 py-0.5 bg-yellow-600/30 text-yellow-300 text-xs font-bold rounded-full">
                                VIP
                              </span>
                            )}
                          </div>
                          
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-800/50">
                <Link href="/tr/ai-lens/global-discourse">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                  >
                    <span>Söyleşiye Katıl</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State Info */}
        {!isExpanded && (
          <div className="px-4 py-2 bg-slate-800/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{stats.activeTopics} aktif konu</span>
              <span className="text-purple-400 font-medium">{stats.messagesPerMinute}/dk mesaj</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* Custom scrollbar styles */
<style jsx>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgb(30 41 59);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(100 116 139);
    border-radius: 2px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(148 163 184);
  }
`}</style>
