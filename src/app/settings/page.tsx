'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PricingPlans } from '@/components/subscription/PricingPlans';
import { SidebarAdBanner } from '@/components/ads/AdBanner';
import { 
  CreditCard, 
  Globe, 
  Bell, 
  Shield, 
  Download,
  Eye,
  Zap,
  Crown,
  BarChart3,
  Settings as SettingsIcon,
  User,
  DollarSign
} from 'lucide-react';

interface UserStats {
  apiRequests: {
    used: number;
    limit: number;
    resetDate: string;
  };
  currentPlan: string;
  nextBilling: string;
  totalSpent: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('billing');
  const [userStats, setUserStats] = useState<UserStats>({
    apiRequests: { used: 1247, limit: 3000, resetDate: '2024-02-01' },
    currentPlan: 'basic',
    nextBilling: '2024-01-15',
    totalSpent: 89.97
  });

  const [geoLocation, setGeoLocation] = useState({
    country: 'TR',
    detectedLanguage: 'tr'
  });

  useEffect(() => {
    // Geo location API'sinden kullanıcının konumunu al
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => {
        setGeoLocation({
          country: data.country || 'TR',
          detectedLanguage: data.language || 'tr'
        });
      })
      .catch(() => {
        console.log('Geo API kullanılamıyor, Türkiye varsayılanı kullanılıyor');
      });
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'billing', label: 'Faturalama', icon: CreditCard },
    { id: 'usage', label: 'API Kullanımı', icon: BarChart3 },
    { id: 'language', label: 'Dil & Bölge', icon: Globe },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'premium', label: 'Premium Özellikler', icon: Crown }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'billing':
        return (
          <div className="space-y-8">
            {/* Current Plan Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mevcut Planınız</h3>
                  <p className="text-gray-600">
                    {userStats.currentPlan === 'basic' ? 'Temel Plan' : 'Ücretsiz Plan'} - Aktif
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {userStats.currentPlan === 'basic' ? '29.99 ₺' : '0 ₺'}
                  </div>
                  <div className="text-sm text-gray-500">aylık</div>
                </div>
              </div>
              
              {userStats.currentPlan === 'basic' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">3,000</div>
                    <div className="text-sm text-gray-600">API İstek/Ay</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">Reklamsız</div>
                    <div className="text-sm text-gray-600">Deneyim</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">Premium</div>
                    <div className="text-sm text-gray-600">Destek</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">PDF</div>
                    <div className="text-sm text-gray-600">Export</div>
                  </div>
                </div>
              )}
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fatura Geçmişi</h3>
              <div className="space-y-3">
                {[
                  { date: '01 Ocak 2024', amount: '29.99 ₺', status: 'Ödendi', invoice: '#INV-2024-001' },
                  { date: '01 Aralık 2023', amount: '29.99 ₺', status: 'Ödendi', invoice: '#INV-2023-012' },
                  { date: '01 Kasım 2023', amount: '29.99 ₺', status: 'Ödendi', invoice: '#INV-2023-011' }
                ].map((bill, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">{bill.invoice}</div>
                      <div className="text-sm text-gray-500">{bill.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{bill.amount}</div>
                      <div className="text-sm text-green-600">{bill.status}</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <Download className="w-4 h-4 inline mr-1" />
                      İndir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Plans */}
            <PricingPlans />
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            {/* API Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Bu Ay Kullanılan</h3>
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">{userStats.apiRequests.used.toLocaleString()}</div>
                <div className="text-blue-100">API İsteği</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Kalan Limit</h3>
                  <Eye className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">
                  {(userStats.apiRequests.limit - userStats.apiRequests.used).toLocaleString()}
                </div>
                <div className="text-green-100">API İsteği</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Toplam Harcama</h3>
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">{userStats.totalSpent.toFixed(2)} ₺</div>
                <div className="text-purple-100">Bugüne kadar</div>
              </div>
            </div>

            {/* Usage Chart Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Günlük API Kullanımı</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3" />
                  <p>Kullanım grafiği burada gösterilecek</p>
                  <p className="text-sm">Chart.js veya D3.js ile entegre edilecek</p>
                </div>
              </div>
            </div>

            {/* Top API Endpoints */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">En Çok Kullanılan API Endpoint'leri</h3>
              <div className="space-y-4">
                {[
                  { endpoint: '/api/newsai', requests: 456, percentage: 37 },
                  { endpoint: '/api/climateai', requests: 321, percentage: 26 },
                  { endpoint: '/api/search', requests: 234, percentage: 19 },
                  { endpoint: '/api/agricultureai', requests: 189, percentage: 15 },
                  { endpoint: '/api/geo', requests: 47, percentage: 3 }
                ].map((api, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{api.endpoint}</div>
                      <div className="text-sm text-gray-500">{api.requests} istek</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-gray-700">{api.percentage}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${api.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dil ve Bölge Ayarları</h3>
              
              <div className="space-y-6">
                {/* Detected Location */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Otomatik Tespit Edilen Konum</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Ülke:</span> {geoLocation.country}
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Dil:</span> {geoLocation.detectedLanguage.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arayüz Dili
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>

                {/* Region Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bölge
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="TR">Türkiye</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                  </select>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para Birimi
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="TRY">Türk Lirası (₺)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Ayarları Kaydet
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">Bu bölüm yakında tamamlanacak.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-2">
            Hesap ayarlarınızı yönetin ve premium özelliklerinizi görüntüleyin
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              {/* Sidebar Ad */}
              <div className="mt-8">
                <SidebarAdBanner adSlot="1122334455" className="w-full" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
