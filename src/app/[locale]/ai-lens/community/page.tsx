"use client";

import { useState } from 'react';
import { Users, MessageCircle, Heart, Share2, TrendingUp, UserPlus } from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Topluluk Merkezi 👥
              </h1>
              <p className="text-gray-300 text-lg">
                Tarım uzmanları ve AI geliştiricileri topluluğu
              </p>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">12.4k</span>
            </div>
            <h3 className="text-gray-300 mb-1">Topluluk Üyesi</h3>
            <p className="text-cyan-400 text-sm">+247 bu ay</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">8.9k</span>
            </div>
            <h3 className="text-gray-300 mb-1">Aktif Tartışma</h3>
            <p className="text-green-400 text-sm">+156 bu hafta</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">347</span>
            </div>
            <h3 className="text-gray-300 mb-1">Uzman Kontribütör</h3>
            <p className="text-purple-400 text-sm">Doğrulanmış</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">1.2M</span>
            </div>
            <h3 className="text-gray-300 mb-1">Paylaşım</h3>
            <p className="text-orange-400 text-sm">Son 6 ay</p>
          </div>
        </div>

        {/* Community Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: 'feed', label: 'Ana Akış', icon: TrendingUp },
            { id: 'discussions', label: 'Tartışmalar', icon: MessageCircle },
            { id: 'experts', label: 'Uzmanlar', icon: Users },
            { id: 'events', label: 'Etkinlikler', icon: Share2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-800'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Community Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Toplulukla Paylaş</h3>
              <textarea
                placeholder="Tarım ve AI konularında düşüncelerinizi paylaşın..."
                className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors">📷</button>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors">📊</button>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors">📎</button>
                </div>
                <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
                  Paylaş
                </button>
              </div>
            </div>

            {/* Community Posts */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">
                        {['Ahmet Tarımoğlu', 'Elif Teknoloji', 'Mehmet Analiz', 'Ayşe Veri', 'Can AI'][index]}
                      </h4>
                      <span className="text-cyan-400 text-sm">✓ Uzman</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {['Tarım Mühendisi', 'AI Uzmanı', 'Veri Analisti', 'Sistem Mimarı', 'ML Geliştirici'][index]} • 2 saat önce
                    </p>
                    <p className="text-gray-300 mb-4">
                      {[
                        'Yapay zeka destekli tarım sistemlerinin sürdürülebilirlik üzerindeki etkilerini inceliyorum. Özellikle su kullanımında %30 tasarruf sağladığımız sonuçları görmek çok heyecan verici! 🌱',
                        'Drone teknolojisi ile bitki hastalığı tespitinde yeni algoritmamız %95 doğruluk oranına ulaştı. Detayları yakında paylaşacağım.',
                        'Pazar analiz raporlarımız bu ay rekor düzeyde kullanıldı. Çiftçilerimizin AI teknolojisine olan ilgisi artıyor! 📊',
                        'Yeni geliştirdiğimiz IoT sensör ağı sistemi gerçek zamanlı toprak analizi yapabiliyor. Test sonuçları çok başarılı.',
                        'Makine öğrenmesi modelimizle hava durumu tahminlerinde %98 doğruluk elde ettik. Tarım planlaması için devrim niteliğinde!'
                      ][index]}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>{Math.floor(Math.random() * 50) + 20}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{Math.floor(Math.random() * 20) + 5}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <Share2 className="h-5 w-5" />
                        Paylaş
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Trend Konular</h3>
              <div className="space-y-3">
                {[
                  '#DroneTarım',
                  '#SürdürülebilirTarım', 
                  '#AIZiraat',
                  '#AkıllıSensörler',
                  '#BitkiSağlığı'
                ].map(topic => (
                  <div key={topic} className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <span className="text-cyan-400 font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">En Aktif Uzmanlar</h3>
              <div className="space-y-4">
                {[
                  { name: 'Dr. Ömer Bilişim', field: 'AI Uzmanı', contributions: 234 },
                  { name: 'Prof. Zehra Tarım', field: 'Ziraat Mühendisi', contributions: 198 },
                  { name: 'Ing. Kemal Veri', field: 'Veri Bilimci', contributions: 167 }
                ].map((expert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {expert.name.split(' ')[1][0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{expert.name}</h4>
                      <p className="text-gray-400 text-sm">{expert.field}</p>
                    </div>
                    <button className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-cyan-600 transition-colors">
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Yaklaşan Etkinlikler</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-white font-semibold mb-1">AI Tarım Konferansı</h4>
                  <p className="text-gray-300 text-sm mb-2">20 Aralık 2024 • Online</p>
                  <p className="text-cyan-400 text-xs">156 katılımcı</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-white font-semibold mb-1">Drone Teknolojisi Workshop</h4>
                  <p className="text-gray-300 text-sm mb-2">25 Aralık 2024 • İstanbul</p>
                  <p className="text-cyan-400 text-xs">89 katılımcı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
