"use client";

import { useState } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'Başlangıç',
      price: '₺299',
      period: '/ay',
      features: [
        'Temel AI analizi',
        '100 API çağrısı/gün',
        'Email destek',
        '1 tarım alanı'
      ]
    },
    {
      id: 'pro',
      name: 'Profesyonel',
      price: '₺899',
      period: '/ay',
      popular: true,
      features: [
        'Gelişmiş AI modelleri',
        '1,000 API çağrısı/gün',
        'Öncelikli destek',
        '10 tarım alanı',
        'Gerçek zamanlı analiz',
        'Özel raporlar'
      ]
    },
    {
      id: 'enterprise',
      name: 'Kurumsal',
      price: '₺2,499',
      period: '/ay',
      features: [
        'Tüm AI özellikleri',
        'Sınırsız API',
        '7/24 destek',
        'Sınırsız alan',
        'Özel entegrasyon',
        'SLA garantisi',
        'Kişisel hesap yöneticisi'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500 p-3 rounded-xl shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Faturalama & Planlar 💳
              </h1>
              <p className="text-gray-300 text-lg">
                AI tarım çözümleriniz için esnek fiyatlandırma
              </p>
            </div>
          </div>
        </div>

        {/* Current Usage */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">Ödendi</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">₺899</h3>
            <p className="text-gray-300">Bu Ay Fatura</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-blue-400 text-sm font-medium">Aktif</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Pro Plan</h3>
            <p className="text-gray-300">Mevcut Plan</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-purple-400 text-sm font-medium">12 gün</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Yenileme</h3>
            <p className="text-gray-300">Sonraki Ödeme</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-orange-400 text-sm font-medium">847/1000</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">API Kullanımı</h3>
            <p className="text-gray-300">Bu Ay</p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Fiyatlandırma Planları
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 scale-105'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-2 rounded-full text-sm">
                      En Popüler
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">KDV Dahil</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Mevcut Plan' : 'Planı Seç'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History & Payment Method */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Billing History */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Fatura Geçmişi</h2>
            
            <div className="space-y-4">
              {[
                { date: '15 Aralık 2024', amount: '₺899', status: 'paid', plan: 'Pro Plan' },
                { date: '15 Kasım 2024', amount: '₺899', status: 'paid', plan: 'Pro Plan' },
                { date: '15 Ekim 2024', amount: '₺299', status: 'paid', plan: 'Başlangıç Plan' },
                { date: '15 Eylül 2024', amount: '₺299', status: 'paid', plan: 'Başlangıç Plan' }
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold mb-1">{invoice.plan}</h4>
                    <p className="text-gray-400 text-sm">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">{invoice.amount}</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 text-sm">Ödendi</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-600 transition-colors">
              Tüm Faturaları Görüntüle
            </button>
          </div>

          {/* Payment Method */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Ödeme Yöntemi</h2>
            
            <div className="space-y-4">
              {/* Credit Card */}
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Kredi Kartı</h4>
                    <p className="text-gray-400 text-sm">**** **** **** 1234</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">Varsayılan</span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    Düzenle
                  </button>
                </div>
              </div>

              {/* Add Payment Method */}
              <button className="w-full p-4 bg-slate-700/20 border-2 border-dashed border-slate-600 rounded-lg text-gray-400 hover:border-slate-500 hover:text-gray-300 transition-all">
                + Yeni Ödeme Yöntemi Ekle
              </button>
            </div>

            {/* Usage Details */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Bu Ay Kullanım</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">API Çağrıları</span>
                  <span className="text-white">847 / 1,000</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '84.7%' }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Veri İşleme</span>
                  <span className="text-white">12.4 GB / 50 GB</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.8%' }}></div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Raporlar</span>
                  <span className="text-white">23 / Sınırsız</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
