"use client";

import { useState } from 'react';
import { FileText, Image, Video, Music, Download, Upload, Eye } from 'lucide-react';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('images');

  const mediaTypes = [
    { id: 'images', label: 'Görseller', icon: Image, count: 245 },
    { id: 'videos', label: 'Videolar', icon: Video, count: 67 },
    { id: 'documents', label: 'Dökümanlar', icon: FileText, count: 189 },
    { id: 'audio', label: 'Ses Dosyaları', icon: Music, count: 34 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500 p-3 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Medya Merkezi 📱
              </h1>
              <p className="text-gray-300 text-lg">
                AI destekli medya yönetimi ve analizi
              </p>
            </div>
          </div>
        </div>

        {/* Media Type Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {mediaTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                activeTab === type.id
                  ? 'bg-pink-500 text-white shadow-lg scale-105'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-800'
              }`}
            >
              <type.icon className="h-5 w-5" />
              <span>{type.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === type.id ? 'bg-white/20' : 'bg-slate-700'
              }`}>
                {type.count}
              </span>
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Dosya Yükle</h3>
            <p className="text-gray-300 mb-4">
              Sürükle bırak veya tıklayarak dosyalarınızı yükleyin
            </p>
            <button className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors">
              Dosya Seç
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          {/* Sample Media Items */}
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 group hover:scale-105 transition-transform">
              <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                {activeTab === 'images' && <Image className="h-8 w-8 text-pink-400" />}
                {activeTab === 'videos' && <Video className="h-8 w-8 text-pink-400" />}
                {activeTab === 'documents' && <FileText className="h-8 w-8 text-pink-400" />}
                {activeTab === 'audio' && <Music className="h-8 w-8 text-pink-400" />}
              </div>
              
              <div className="p-4">
                <h4 className="text-white font-semibold mb-1">
                  {activeTab === 'images' && `Tarım Görseli ${index + 1}`}
                  {activeTab === 'videos' && `Eğitim Videosu ${index + 1}`}
                  {activeTab === 'documents' && `Rapor ${index + 1}`}
                  {activeTab === 'audio' && `Podcast ${index + 1}`}
                </h4>
                <p className="text-gray-400 text-sm mb-3">
                  {new Date().toLocaleDateString('tr-TR')}
                </p>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    Görüntüle
                  </button>
                  <button className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analysis Panel */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">AI Medya Analizi</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
              <p className="text-gray-300">Kalite Skoru</p>
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-400 mb-2">1,247</div>
              <p className="text-gray-300">İşlenen Dosya</p>
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-3xl font-bold text-purple-400 mb-2">85.6 GB</div>
              <p className="text-gray-300">Toplam Boyut</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI İçerik Önerileri</h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-700/20 rounded-lg">
                <p className="text-gray-300">📸 Tarım fotoğraflarınızda %15 daha iyi aydınlatma için öneriler mevcut</p>
              </div>
              <div className="p-4 bg-slate-700/20 rounded-lg">
                <p className="text-gray-300">🎥 Video içeriklerinizde ses kalitesi optimizasyonu önerilir</p>
              </div>
              <div className="p-4 bg-slate-700/20 rounded-lg">
                <p className="text-gray-300">📄 Dokümanlarda OCR ile metin çıkarımı tamamlandı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
