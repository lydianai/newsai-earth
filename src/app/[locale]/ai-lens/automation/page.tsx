"use client";

import { useState } from 'react';
import { Cog, Zap, Play, Pause, Settings, Activity } from 'lucide-react';

export default function AutomationPage() {
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Günlük Veri Toplama', status: 'active', runs: 247 },
    { id: 2, name: 'Hava Durumu Analizi', status: 'paused', runs: 189 },
    { id: 3, name: 'Pazar Fiyat Takibi', status: 'active', runs: 156 }
  ]);

  const toggleAutomation = (id: number) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id 
        ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
        : auto
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
              <Cog className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Otomasyon Merkezi ⚙️
              </h1>
              <p className="text-gray-300 text-lg">
                AI destekli otomasyon süreçleri ve iş akışları
              </p>
            </div>
          </div>
        </div>

        {/* Automation Statistics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <h3 className="text-gray-300 mb-1">Aktif Otomasyon</h3>
            <p className="text-green-400 text-sm">3 yeni bu hafta</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">1,247</span>
            </div>
            <h3 className="text-gray-300 mb-1">Toplam Çalışma</h3>
            <p className="text-blue-400 text-sm">Son 30 gün</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">98.7%</span>
            </div>
            <h3 className="text-gray-300 mb-1">Başarı Oranı</h3>
            <p className="text-purple-400 text-sm">+1.2% bu ay</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Cog className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">4.2h</span>
            </div>
            <h3 className="text-gray-300 mb-1">Zaman Tasarrufu</h3>
            <p className="text-orange-400 text-sm">Günlük ortalama</p>
          </div>
        </div>

        {/* Automation Management */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Automations */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Mevcut Otomasyonlar</h2>
            
            <div className="space-y-4">
              {automations.map(automation => (
                <div key={automation.id} className="p-4 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {automation.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        automation.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {automation.status === 'active' ? 'Aktif' : 'Durduruldu'}
                      </span>
                      <button
                        onClick={() => toggleAutomation(automation.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          automation.status === 'active'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {automation.status === 'active' 
                          ? <Pause className="h-4 w-4 text-white" />
                          : <Play className="h-4 w-4 text-white" />
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {automation.runs} başarılı çalışma
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      Ayarları Düzenle
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all">
              Yeni Otomasyon Oluştur
            </button>
          </div>

          {/* Automation Templates */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Otomasyon Şablonları</h2>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Veri Toplama Otomasyonu',
                  description: 'Tarımsal sensörlerden otomatik veri toplama',
                  icon: Activity,
                  color: 'bg-blue-500'
                },
                {
                  title: 'Rapor Oluşturma',
                  description: 'Haftalık analiz raporlarının otomatik oluşturulması',
                  icon: Settings,
                  color: 'bg-green-500'
                },
                {
                  title: 'Uyarı Sistemi',
                  description: 'Kritik durumlarda otomatik bildirim gönderme',
                  icon: Zap,
                  color: 'bg-red-500'
                },
                {
                  title: 'Yedekleme Sistemi',
                  description: 'Günlük veri yedekleme ve arşivleme',
                  icon: Cog,
                  color: 'bg-purple-500'
                }
              ].map((template, index) => (
                <div key={index} className="p-4 bg-slate-700/20 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`${template.color} p-3 rounded-lg`}>
                      <template.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {template.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {template.description}
                      </p>
                    </div>
                    <button className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Kullan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Son Aktiviteler</h2>
          
          <div className="space-y-3">
            {[
              { time: '2 dakika önce', action: 'Günlük veri toplama tamamlandı', status: 'success' },
              { time: '15 dakika önce', action: 'Hava durumu analizi başlatıldı', status: 'running' },
              { time: '1 saat önce', action: 'Pazar fiyat raporu oluşturuldu', status: 'success' },
              { time: '3 saat önce', action: 'Uyarı sistemi tetiklendi', status: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'running' ? 'bg-blue-400' :
                    'bg-yellow-400'
                  }`}></div>
                  <span className="text-white">{activity.action}</span>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
