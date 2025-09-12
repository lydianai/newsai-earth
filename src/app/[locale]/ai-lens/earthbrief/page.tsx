'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  MapPin, 
  RefreshCw, 
  Filter,
  ExternalLink,
  Zap,
  BarChart3,
  Newspaper,
  Shield,
  Eye,
  Calendar,
  Users
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceRosette: string;
  publishedAt: string;
  category: string;
  language: string;
  originalUrl: string;
  factScore?: number;
  consensusScore?: number;
  country?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  sentiment?: 'positive' | 'neutral' | 'negative';
  impact?: number;
  readTime?: number;
}

interface LiveEvent {
  id: string;
  type: 'earthquake' | 'politics' | 'economic' | 'weather' | 'conflict';
  title: string;
  location: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  source: string;
}

interface EarthBriefMetrics {
  total_articles: number;
  sources_active: number;
  languages_covered: number;
  countries_covered: number;
  last_update: string;
  articles_per_hour: number;
  fact_check_rate: number;
  global_sentiment: number;
}

export default function EarthBrief() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [metrics, setMetrics] = useState<EarthBriefMetrics | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("tr");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Fetch real news data
  const fetchEarthBriefData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch articles, events, and metrics
      const [articlesRes, eventsRes, metricsRes] = await Promise.all([
        fetch('/api/ai-lens/earthbrief/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            language: selectedLanguage, 
            category: selectedCategory,
            urgency: selectedUrgency,
            limit: 20
          })
        }),
        fetch('/api/ai-lens/earthbrief/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: selectedCategory === 'all' ? 'all' : selectedCategory,
            severity: 'all',
            eventType: 'all',
            limit: 30
          })
        }),
        fetch('/api/ai-lens/earthbrief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
      ]);

      const [articlesData, eventsData, metricsData] = await Promise.all([
        articlesRes.json(),
        eventsRes.json(),
        metricsRes.json()
      ]);

      if (articlesData.success) {
        setArticles(articlesData.articles || []);
      }
      
      if (eventsData.success) {
        setLiveEvents(eventsData.events || []);
      }
      
      if (metricsData.success) {
        setMetrics(metricsData);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch EarthBrief data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, selectedCategory, selectedUrgency]);

  // Auto-refresh every hour
  useEffect(() => {
    fetchEarthBriefData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchEarthBriefData();
      }, 3600000); // 1 hour
      
      return () => clearInterval(interval);
    }
  }, [fetchEarthBriefData, autoRefresh]);

  const categories = [
    { value: "all", label: "All Categories", icon: "🌍" },
    { value: "politics", label: "Politics", icon: "🏛️" },
    { value: "technology", label: "Technology", icon: "💻" },
    { value: "environment", label: "Environment", icon: "🌱" },
    { value: "energy", label: "Energy", icon: "⚡" },
    { value: "economics", label: "Economics", icon: "💰" },
    { value: "health", label: "Health", icon: "🏥" },
    { value: "science", label: "Science", icon: "🔬" },
    { value: "climate", label: "Climate", icon: "🌡️" }
  ];

  const languages = [
    { value: "all", label: "All Languages" },
    { value: "tr", label: "Türkçe" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "de", label: "Deutsch" },
    { value: "ru", label: "русский" }
  ];

  const urgencyLevels = [
    { value: "all", label: "All Urgency" },
    { value: "critical", label: "Critical", color: "text-red-400" },
    { value: "high", label: "High", color: "text-orange-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "low", label: "Low", color: "text-green-400" }
  ];

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 0.9) return "text-green-400";
    if (score >= 0.7) return "text-yellow-400";
    return "text-red-400";
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/20 to-indigo-950">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-orange-500/30">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  EarthBrief
                </h1>
                <p className="text-orange-200">Global Live News Engine</p>
              </div>
            </div>

            {/* Auto-refresh toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Last: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  autoRefresh 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}
              >
                {autoRefresh ? 'Auto ON' : 'Auto OFF'}
              </button>
              
              <button
                onClick={fetchEarthBriefData}
                disabled={loading}
                className="p-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Articles', value: metrics.total_articles.toLocaleString(), icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
              { label: 'Sources', value: metrics.sources_active, icon: Shield, color: 'from-green-500 to-emerald-500' },
              { label: 'Languages', value: metrics.languages_covered, icon: Globe, color: 'from-purple-500 to-pink-500' },
              { label: 'Per Hour', value: metrics.articles_per_hour, icon: TrendingUp, color: 'from-orange-500 to-red-500' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-orange-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${metric.color} rounded-lg`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className="text-xs text-gray-400">{metric.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-orange-500/20 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Urgency</label>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                {urgencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* News Articles */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-64"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-400">Loading global news...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="articles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 mb-8"
            >
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-black/30 backdrop-blur-lg rounded-xl p-6 border transition-all hover:scale-[1.02] ${getUrgencyColor(article.urgency)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.urgency && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.urgency === 'critical' ? 'bg-red-500/20 text-red-400' :
                            article.urgency === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            article.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {article.urgency.toUpperCase()}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                          {article.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-white hover:text-orange-300 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-sm gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-orange-400" />
                        {article.sourceRosette}
                      </span>
                      
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.publishedAt).toLocaleString()}
                      </span>
                      
                      {article.country && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {article.country}
                        </span>
                      )}
                      
                      {article.readTime && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Eye className="w-4 h-4" />
                          {article.readTime} min
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {article.factScore && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Fact:</span>
                          <span className={getScoreColor(article.factScore)}>
                            {Math.round(article.factScore * 100)}%
                          </span>
                        </div>
                      )}
                      
                      {article.consensusScore && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">Consensus:</span>
                          <span className={getScoreColor(article.consensusScore)}>
                            {Math.round(article.consensusScore * 100)}%
                          </span>
                        </div>
                      )}
                      
                      <a
                        href={article.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Source
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Events Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-orange-500/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-semibold text-white">Live Global Events</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Live</span>
            </div>
          </div>
          
          {/* Event List */}
          <div className="grid gap-4 mb-6">
            {liveEvents.slice(0, 5).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'earthquake' ? 'bg-red-400' :
                    event.type === 'politics' ? 'bg-blue-400' :
                    event.type === 'economic' ? 'bg-green-400' :
                    event.type === 'weather' ? 'bg-cyan-400' :
                    'bg-yellow-400'
                  }`}></div>
                  <div>
                    <h4 className="text-white font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-400">{event.location}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`text-sm font-medium ${getSeverityColor(event.severity)}`}>
                    {event.severity.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400">{event.source}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="h-64 bg-black/40 rounded-lg flex items-center justify-center border border-gray-500/20">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🗺️
              </motion.div>
              <p className="text-gray-400">Interactive Global Events Map</p>
              <p className="text-sm text-gray-500 mt-2">Real-time visualization coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
