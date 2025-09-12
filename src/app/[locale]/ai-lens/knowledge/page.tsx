'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Brain, 
  Lock, 
  Database, 
  Globe, 
  FileText, 
  ImageIcon, 
  Video, 
  Mic,
  Shield,
  Key,
  Upload,
  Download,
  BookOpen,
  Network,
  Eye,
  TrendingUp
} from 'lucide-react';

interface KnowledgeMetrics {
  total_documents: number;
  vector_embeddings: number;
  search_queries: number;
  knowledge_graphs: number;
  languages_supported: number;
  storage_used: number;
  processing_speed: number;
  accuracy_rate: number;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  relevance: number;
  source: string;
  type: 'document' | 'image' | 'video' | 'audio';
  language: string;
  tags: string[];
  embedding_score: number;
}

interface VaultItem {
  id: string;
  name: string;
  type: 'file' | 'note' | 'password' | 'key';
  size: number;
  encrypted: boolean;
  created: string;
  accessed: string;
  security_level: 'low' | 'medium' | 'high' | 'maximum';
}

export default function Knowledge() {
  const [metrics, setMetrics] = useState<KnowledgeMetrics | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'vault' | 'analytics'>('search');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch knowledge data
  const fetchKnowledgeData = async () => {
    try {
      const response = await fetch('/api/ai-lens/knowledge');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
        setVaultItems(data.vault_items);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch('/api/ai-lens/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          language: selectedLanguage,
          filters: { type: 'all' }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedLanguage, performSearch]);

  useEffect(() => {
    fetchKnowledgeData();
    const interval = setInterval(fetchKnowledgeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Mic className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'maximum':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'high':
        return <Lock className="w-4 h-4 text-orange-400" />;
      case 'medium':
        return <Key className="w-4 h-4 text-yellow-400" />;
      default:
        return <Eye className="w-4 h-4 text-green-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Knowledge Hub
                </h1>
                <p className="text-purple-200">RAG System & Encrypted Vault</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-black/30 rounded-xl p-1">
              {(['search', 'vault', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-purple-500 text-white'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
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
              { label: 'Documents', value: metrics.total_documents.toLocaleString(), icon: Database, color: 'from-blue-500 to-cyan-500' },
              { label: 'Embeddings', value: metrics.vector_embeddings.toLocaleString(), icon: Network, color: 'from-purple-500 to-pink-500' },
              { label: 'Languages', value: metrics.languages_supported, icon: Globe, color: 'from-green-500 to-emerald-500' },
              { label: 'Accuracy', value: `${metrics.accuracy_rate}%`, icon: TrendingUp, color: 'from-orange-500 to-red-500' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20"
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

        <AnimatePresence mode="wait">
          {/* Search Tab */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Search Interface */}
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search knowledge base..."
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="all">All Languages</option>
                    <option value="en">English</option>
                    <option value="tr">Türkçe</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>

              {/* Search Results */}
              <div className="grid gap-4">
                {searchLoading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto"
                    />
                    <p className="text-gray-400 mt-4">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            {getTypeIcon(result.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{result.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{result.source}</span>
                              <span>•</span>
                              <span>{result.language}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-400">
                            {Math.round(result.relevance * 100)}% match
                          </div>
                          <div className="text-xs text-gray-400">
                            Score: {result.embedding_score.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{result.content}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : searchQuery && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No results found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Vault Tab */}
          {activeTab === 'vault' && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Vault Controls */}
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Encrypted Vault</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                    <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">{vaultItems.length}</div>
                    <div className="text-sm text-gray-400">Items</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {Math.round(vaultItems.reduce((acc, item) => acc + item.size, 0) / 1024 / 1024)}MB
                    </div>
                    <div className="text-sm text-gray-400">Storage Used</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">AES-256</div>
                    <div className="text-sm text-gray-400">Encryption</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">100%</div>
                    <div className="text-sm text-gray-400">Secure</div>
                  </div>
                </div>
              </div>

              {/* Vault Items */}
              <div className="grid gap-4">
                {vaultItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-500/20 rounded-lg">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{(item.size / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>Created: {new Date(item.created).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getSecurityIcon(item.security_level)}
                          <span className="text-sm capitalize text-gray-400">{item.security_level}</span>
                        </div>
                        {item.encrypted && (
                          <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                            Encrypted
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && metrics && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">System Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Processing Speed</span>
                    <span className="text-2xl font-bold text-green-400">{metrics.processing_speed}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Search Queries</span>
                    <span className="text-2xl font-bold text-blue-400">{metrics.search_queries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Storage Used</span>
                    <span className="text-2xl font-bold text-purple-400">{metrics.storage_used.toFixed(1)}TB</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Knowledge Graphs</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Graphs</span>
                    <span className="text-2xl font-bold text-cyan-400">{metrics.knowledge_graphs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Vector Dimensions</span>
                    <span className="text-2xl font-bold text-orange-400">1536</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Similarity Threshold</span>
                    <span className="text-2xl font-bold text-pink-400">0.85</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
