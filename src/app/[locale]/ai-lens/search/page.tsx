"use client";

import { useState } from 'react';
import { Search, Filter, Calendar, Globe, TrendingUp } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                AI Powered Search 🔍
              </h1>
              <p className="text-gray-300 text-lg">
                Gelişmiş AI destekli arama ve analiz sistemi
              </p>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Akıllı Arama</h2>
              
              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ne aramak istiyorsun? (Türkçe veya İngilizce)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search Types */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {[
                  { id: 'all', label: 'Tümü', icon: Globe },
                  { id: 'news', label: 'Haberler', icon: TrendingUp },
                  { id: 'research', label: 'Araştırma', icon: Search },
                  { id: 'data', label: 'Veri', icon: Filter }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSearchType(type.id)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      searchType === type.id
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <type.icon className="h-6 w-6" />
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Results Placeholder */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Arama Sonuçları</h3>
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Arama yapmak için yukarıdaki alana yazın</p>
                  <p className="text-gray-500 mt-2">AI destekli anlık sonuçlar görilecek</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Options */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Filtreler</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tarih Aralığı</label>
                  <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                    <option>Son 24 saat</option>
                    <option>Son hafta</option>
                    <option>Son ay</option>
                    <option>Son yıl</option>
                    <option>Tüm zamanlar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Kaynak Türü</label>
                  <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                    <option>Tüm kaynaklar</option>
                    <option>Haber siteleri</option>
                    <option>Akademik yayınlar</option>
                    <option>Sosyal medya</option>
                    <option>Resmi kurumlar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Dil</label>
                  <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                    <option>Türkçe</option>
                    <option>İngilizce</option>
                    <option>Tüm diller</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Trend Aramalar</h3>
              
              <div className="space-y-2">
                {[
                  'Yapay zeka haberleri',
                  'Tarım teknolojisi',
                  'İklim değişikliği',
                  'Sürdürülebilir tarım',
                  'Drone teknolojisi'
                ].map(trend => (
                  <button
                    key={trend}
                    className="w-full text-left p-3 rounded-lg text-gray-300 hover:bg-slate-700/50 transition-colors"
                    onClick={() => setSearchQuery(trend)}
                  >
                    #{trend}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
