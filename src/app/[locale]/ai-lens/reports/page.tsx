"use client";

import { useState } from 'react';
import { FileText, BarChart3, TrendingUp, Calendar, Download, Filter } from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly');

  const reportTypes = [
    {
      id: 'monthly',
      title: 'Aylık Rapor',
      description: 'Aylık performans ve analiz raporu',
      icon: Calendar,
      color: 'bg-blue-500',
      size: '2.4 MB',
      date: '15 Aralık 2024'
    },
    {
      id: 'analytics',
      title: 'Analitik Rapor',
      description: 'Detaylı veri analizi ve trend raporu',
      icon: BarChart3,
      color: 'bg-green-500',
      size: '4.1 MB',
      date: '12 Aralık 2024'
    },
    {
      id: 'forecast',
      title: 'Tahmin Raporu',
      description: 'AI destekli tahmin ve projeksiyon raporu',
      icon: TrendingUp,
      color: 'bg-purple-500',
      size: '3.7 MB',
      date: '10 Aralık 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500 p-3 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Raporlar & Analiz 📋
              </h1>
              <p className="text-gray-300 text-lg">
                AI destekli rapor oluşturma ve analiz sistemi
              </p>
            </div>
          </div>
        </div>

        {/* Report Statistics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">247</span>
            </div>
            <h3 className="text-gray-300 mb-1">Toplam Rapor</h3>
            <p className="text-green-400 text-sm">+12% bu ay</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">94.2%</span>
            </div>
            <h3 className="text-gray-300 mb-1">Doğruluk Oranı</h3>
            <p className="text-green-400 text-sm">+2.1% geçen hafta</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">3.2k</span>
            </div>
            <h3 className="text-gray-300 mb-1">İndirme Sayısı</h3>
            <p className="text-blue-400 text-sm">Son 30 gün</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <h3 className="text-gray-300 mb-1">Otomatik Rapor</h3>
            <p className="text-orange-400 text-sm">Aylık oluşturulan</p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Report List */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Mevcut Raporlar</h2>
              <button className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                <Filter className="h-4 w-4" />
                Filtrele
              </button>
            </div>

            <div className="space-y-4">
              {reportTypes.map(report => (
                <div
                  key={report.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedReport === report.id
                      ? 'border-indigo-400 bg-slate-700/50'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`${report.color} p-3 rounded-lg`}>
                        <report.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {report.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{report.size}</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate New Report */}
            <div className="mt-6 pt-6 border-t border-slate-600">
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all">
                Yeni Rapor Oluştur
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Rapor Önizlemesi</h2>
            
            {selectedReport && (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-500 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {reportTypes.find(r => r.id === selectedReport)?.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {reportTypes.find(r => r.id === selectedReport)?.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sample Chart */}
                <div className="p-4 bg-slate-700/20 rounded-lg">
                  <h4 className="text-white font-semibold mb-4">Performans Grafikleri</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Verimlilik</span>
                        <span className="text-green-400">92%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Kalite</span>
                        <span className="text-blue-400">88%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Maliyet Optimizasyonu</span>
                        <span className="text-purple-400">95%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">+24%</div>
                    <p className="text-gray-300 text-sm">Büyüme Oranı</p>
                  </div>
                  <div className="p-4 bg-slate-700/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">847</div>
                    <p className="text-gray-300 text-sm">Analiz Edilen Veri</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
