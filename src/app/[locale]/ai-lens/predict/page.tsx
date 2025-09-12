"use client";

import { useState } from 'react';
import { TrendingUp, BarChart3, Target, Zap, Activity } from 'lucide-react';

export default function PredictPage() {
  const [selectedModel, setSelectedModel] = useState('crop-yield');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                AI Tahmin Sistemi 📈
              </h1>
              <p className="text-gray-300 text-lg">
                Gelişmiş makine öğrenmesi ile tahminleme ve analiz
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Models */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              id: 'crop-yield',
              title: 'Ürün Verimi',
              description: 'Hasat miktarı tahmini',
              icon: Activity,
              color: 'bg-green-500',
              accuracy: '94%'
            },
            {
              id: 'market-price',
              title: 'Piyasa Fiyatları',
              description: 'Fiyat trend analizi',
              icon: BarChart3,
              color: 'bg-blue-500',
              accuracy: '89%'
            },
            {
              id: 'weather-impact',
              title: 'Hava Durumu Etkisi',
              description: 'İklim etkisi tahmini',
              icon: Target,
              color: 'bg-orange-500',
              accuracy: '91%'
            },
            {
              id: 'risk-assessment',
              title: 'Risk Değerlendirme',
              description: 'Tarımsal risk analizi',
              icon: Zap,
              color: 'bg-red-500',
              accuracy: '87%'
            }
          ].map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-6 rounded-2xl border transition-all ${
                selectedModel === model.id
                  ? 'border-white/30 bg-slate-800/70 scale-105'
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800/60'
              }`}
            >
              <div className={`${model.color} p-3 rounded-xl w-fit mb-4`}>
                <model.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{model.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{model.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold">Doğruluk: {model.accuracy}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Prediction Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Tahmin Parametreleri</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Bölge Seçimi</label>
                <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                  <option>Marmara Bölgesi</option>
                  <option>Ege Bölgesi</option>
                  <option>Akdeniz Bölgesi</option>
                  <option>İç Anadolu Bölgesi</option>
                  <option>Karadeniz Bölgesi</option>
                  <option>Doğu Anadolu Bölgesi</option>
                  <option>Güneydoğu Anadolu Bölgesi</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Ürün Türü</label>
                <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                  <option>Buğday</option>
                  <option>Mısır</option>
                  <option>Pamuk</option>
                  <option>Ayçiçeği</option>
                  <option>Arpa</option>
                  <option>Şeker pancarı</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Zaman Periyodu</label>
                <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                  <option>Sonraki ay</option>
                  <option>Sonraki sezon</option>
                  <option>Sonraki yıl</option>
                  <option>3 yıl projeksiyonu</option>
                  <option>5 yıl projeksiyonu</option>
                </select>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all">
                Tahmin Oluştur
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Tahmin Sonuçları</h2>
            
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Tahmin parametrelerini seçin</p>
              <p className="text-gray-500">AI modelimiz analizi gerçekleştirecek</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Model Performansı</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Doğruluk Oranı:</span>
                  <span className="text-green-400">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Güven Aralığı:</span>
                  <span className="text-blue-400">±3.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
