"use client";

import { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500 p-3 rounded-xl shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Analitik Dashboard 📊
              </h1>
              <p className="text-gray-300 text-lg">
                AI destekli veri analizi ve performans metrikleri
              </p>
            </div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'week', label: 'Son Hafta' },
            { id: 'month', label: 'Son Ay' },
            { id: 'quarter', label: 'Çeyrek' },
            { id: 'year', label: 'Yıl' }
          ].map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPeriod === period.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-800'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">₺847K</h3>
            <p className="text-gray-300">Toplam Gelir</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">+8.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">12,847</h3>
            <p className="text-gray-300">Aktif Kullanıcı</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">+15.7%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">94.2%</h3>
            <p className="text-gray-300">Müşteri Memnuniyeti</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">+3.1%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">2.4M</h3>
            <p className="text-gray-300">Toplam İşlem</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Gelir Analizi</h2>
              <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Mock Chart Data */}
            <div className="space-y-4">
              {[
                { month: 'Ocak', value: 67, color: 'bg-blue-500' },
                { month: 'Şubat', value: 78, color: 'bg-green-500' },
                { month: 'Mart', value: 89, color: 'bg-purple-500' },
                { month: 'Nisan', value: 94, color: 'bg-yellow-500' },
                { month: 'Mayıs', value: 82, color: 'bg-red-500' },
                { month: 'Haziran', value: 96, color: 'bg-indigo-500' }
              ].map(item => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="text-gray-300 w-16 text-sm">{item.month}</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-3">
                    <div 
                      className={`${item.color} h-3 rounded-full`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold w-12 text-sm">{item.value}%</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-emerald-400 text-sm">
                📈 Bu ay gelir hedefinin %112'sini tamamladınız
              </p>
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Kullanıcı Aktivitesi</h2>
              <select className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600">
                <option>Son 7 gün</option>
                <option>Son 30 gün</option>
                <option>Son 90 gün</option>
              </select>
            </div>

            {/* Activity Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-700/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">8,247</div>
                <p className="text-gray-300 text-sm">Günlük Ziyaretçi</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">4.2h</div>
                <p className="text-gray-300 text-sm">Ortalama Süre</p>
              </div>
            </div>

            {/* User Segments */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Yeni Kullanıcılar</span>
                <span className="text-green-400 font-semibold">34%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Aktif Kullanıcılar</span>
                <span className="text-blue-400 font-semibold">52%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Dönen Kullanıcılar</span>
                <span className="text-purple-400 font-semibold">14%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Features */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">En Çok Kullanılan Özellikler</h2>
            
            <div className="space-y-4">
              {[
                { feature: 'AGRI LENS Dashboard', usage: 89 },
                { feature: 'Hava Durumu Analizi', usage: 76 },
                { feature: 'Ürün Tahmin AI', usage: 68 },
                { feature: 'Pazar Analizi', usage: 54 },
                { feature: 'IoT Sensör Takibi', usage: 42 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${item.usage}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold text-sm w-8">{item.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Coğrafi Dağılım</h2>
            
            <div className="space-y-4">
              {[
                { region: 'Marmara', percentage: 32, users: '4,234' },
                { region: 'İç Anadolu', percentage: 24, users: '3,089' },
                { region: 'Akdeniz', percentage: 18, users: '2,314' },
                { region: 'Ege', percentage: 16, users: '2,056' },
                { region: 'Diğer', percentage: 10, users: '1,284' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{item.region}</span>
                    <span className="text-white font-semibold">{item.users}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Performans İnsightları</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Pozitif Trend</span>
                </div>
                <p className="text-gray-300 text-sm">
                  AI model doğruluğu son 30 günde %3.2 arttı
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Optimizasyon</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Sistem yanıt süresi %15 iyileşti
                </p>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold">Kullanım Artışı</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Mobil uygulama kullanımı %24 arttı
                </p>
              </div>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all">
              Detaylı Rapor Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
