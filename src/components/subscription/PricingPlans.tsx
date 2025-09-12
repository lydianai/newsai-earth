'use client';

import React, { useState, useEffect } from 'react';
import { subscriptionPlans, getAnnualPlans, getLocalizedPrice } from '../../lib/subscription';
import { SubscriptionPlan } from '../../../types/subscription';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isAnnual: boolean;
  countryCode: string;
  onSelectPlan: (planId: string) => void;
  currentPlan?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  isAnnual, 
  countryCode, 
  onSelectPlan, 
  currentPlan 
}) => {
  const localizedPrice = getLocalizedPrice(plan, countryCode);
  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.price === 0;

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg p-8 ${
      plan.isPopular ? 'ring-2 ring-blue-500 transform scale-105' : ''
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            En Popüler
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-gray-900 mb-1">
          {isFree ? 'Ücretsiz' : `${localizedPrice.price} ${localizedPrice.currency}`}
          {!isFree && (
            <span className="text-lg font-normal text-gray-500">
              /{isAnnual ? 'yıl' : 'ay'}
            </span>
          )}
        </div>
        {isAnnual && !isFree && (
          <div className="text-sm text-green-600 font-medium">
            %20 indirim - 2 ay ücretsiz!
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelectPlan(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
          isCurrentPlan
            ? 'bg-green-100 text-green-800 cursor-not-allowed'
            : plan.isPopular
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        {isCurrentPlan ? 'Mevcut Planınız' : isFree ? 'Ücretsiz Başlat' : 'Planı Seç'}
      </button>

      {!isFree && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            API Limiti: {plan.apiRequestLimit.toLocaleString()} istek/ay
          </p>
        </div>
      )}
    </div>
  );
};

export const PricingPlans: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [countryCode, setCountryCode] = useState('TR');
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcının ülkesini API'den al
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => {
        setCountryCode(data.country || 'TR');
      })
      .catch(() => {
        setCountryCode('TR'); // Fallback
      });

    // Kullanıcının mevcut planını al (mock data)
    // Gerçek uygulamada auth context'ten gelecek
    setTimeout(() => {
      setCurrentPlan('free');
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      // Ücretsiz plan için direkt geçiş
      setCurrentPlan(planId);
      return;
    }

    // Premium planlar için ödeme sayfasına yönlendir
    const checkoutUrl = `/api/payments/checkout?plan=${planId}&annual=${isAnnual}&country=${countryCode}`;
    window.location.href = checkoutUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const plans = isAnnual ? getAnnualPlans() : subscriptionPlans;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          İhtiyacınıza Uygun Planı Seçin
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          AI destekli haber analizi ve insights için esnek fiyatlandırma
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Aylık
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isAnnual ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Yıllık
          </span>
          {isAnnual && (
            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              %20 İndirim
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isAnnual={isAnnual}
            countryCode={countryCode}
            onSelectPlan={handleSelectPlan}
            currentPlan={currentPlan}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          Sıkça Sorulan Sorular
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              API limitleri nasıl çalışır?
            </h4>
            <p className="text-gray-600">
              Her plan için aylık API istek limiti vardır. Limit aşıldığında yeni ay başına kadar beklemek veya plan yükseltmek gerekir.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Plan değiştirme nasıl yapılır?
            </h4>
            <p className="text-gray-600">
              İstediğiniz zaman plan yükseltmesi yapabilirsiniz. Düşürme işlemleri mevcut dönem sonunda geçerli olur.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              İptal etme politikası nedir?
            </h4>
            <p className="text-gray-600">
              İstediğiniz zaman iptal edebilirsiniz. Ücret iadesi mevcut dönem sonuna kadar kullanım hakkı şeklinde yapılır.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Kurumsal çözümler mevcut mu?
            </h4>
            <p className="text-gray-600">
              Evet, kurumsal planımız özel entegrasyonlar, SLA ve dedicated support içerir. İletişime geçin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
