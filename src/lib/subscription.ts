import { SubscriptionPlan } from '../../types/subscription';

// Türkiye için özelleştirilmiş premium planlar
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    nameEn: 'Free',
    price: 0,
    currency: 'TRY',
    interval: 'month',
    features: [
      'Günde 10 AI sorgusu',
      'Temel haber analizi',
      'Standart destek',
      'Reklam içerikli deneyim'
    ],
    featuresEn: [
      '10 AI queries per day',
      'Basic news analysis',
      'Standard support',
      'Ad-supported experience'
    ],
    apiRequestLimit: 300, // Ayda 300 istek
    priority: 3
  },
  {
    id: 'basic',
    name: 'Temel',
    nameEn: 'Basic',
    price: 29.99,
    currency: 'TRY',
    interval: 'month',
    features: [
      'Günde 100 AI sorgusu',
      'Gelişmiş analitik',
      'Öncelikli destek',
      'Reklamsız deneyim',
      'PDF export'
    ],
    featuresEn: [
      '100 AI queries per day',
      'Advanced analytics',
      'Priority support',
      'Ad-free experience',
      'PDF export'
    ],
    apiRequestLimit: 3000, // Ayda 3.000 istek
    priority: 2
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    nameEn: 'Professional',
    price: 99.99,
    currency: 'TRY',
    interval: 'month',
    features: [
      'Sınırsız AI sorgusu',
      'Özel raporlar',
      '7/24 premium destek',
      'API erişimi',
      'White-label çözümler',
      'Gerçek zamanlı bildirimler',
      'Çoklu dil desteği'
    ],
    featuresEn: [
      'Unlimited AI queries',
      'Custom reports',
      '24/7 premium support',
      'API access',
      'White-label solutions',
      'Real-time notifications',
      'Multi-language support'
    ],
    apiRequestLimit: 25000, // Ayda 25.000 istek
    priority: 1,
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    nameEn: 'Enterprise',
    price: 499.99,
    currency: 'TRY',
    interval: 'month',
    features: [
      'Sınırsız her şey',
      'Özel entegrasyon',
      'Dedicated account manager',
      'SLA garantisi',
      'Özel eğitim',
      'Bulk API erişimi',
      'Gelişmiş güvenlik',
      'Özel deployment'
    ],
    featuresEn: [
      'Unlimited everything',
      'Custom integration',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom training',
      'Bulk API access',
      'Advanced security',
      'Custom deployment'
    ],
    apiRequestLimit: 100000, // Ayda 100.000 istek
    priority: 0
  }
];

// Yıllık planlar için indirim oranları
export const annualDiscountPercent = 20;

// Yıllık planları hesapla
export const getAnnualPlans = (): SubscriptionPlan[] => {
  return subscriptionPlans.map(plan => ({
    ...plan,
    id: `${plan.id}_annual`,
    interval: 'year' as const,
    price: Math.round(plan.price * 12 * (100 - annualDiscountPercent) / 100),
    features: [...plan.features, '2 ay ücretsiz (yıllık ödeme)'],
    featuresEn: [...plan.featuresEn, '2 months free (annual billing)']
  }));
};

// Plan özelliklerini kontrol et
export const hasFeature = (planId: string, feature: string): boolean => {
  const plan = subscriptionPlans.find(p => p.id === planId);
  if (!plan) return false;
  
  const featureMap: Record<string, string[]> = {
    'free': ['basic_analytics', 'standard_support'],
    'basic': ['advanced_analytics', 'priority_support', 'ad_free', 'pdf_export'],
    'pro': ['unlimited_queries', 'custom_reports', 'api_access', 'white_label', 'realtime_alerts', 'multilang'],
    'enterprise': ['everything', 'custom_integration', 'dedicated_manager', 'sla', 'bulk_api', 'advanced_security']
  };
  
  const planFeatures = featureMap[planId.replace('_annual', '')] || [];
  return planFeatures.includes(feature);
};

// API rate limiting kontrolleri
export const getApiLimits = (planId: string) => {
  const plan = subscriptionPlans.find(p => p.id === planId);
  return {
    monthly: plan?.apiRequestLimit || 300,
    daily: Math.floor((plan?.apiRequestLimit || 300) / 30),
    hourly: Math.floor((plan?.apiRequestLimit || 300) / 30 / 24)
  };
};

// Ülke bazlı fiyatlandırma
export const getLocalizedPrice = (plan: SubscriptionPlan, countryCode: string): { price: number; currency: string } => {
  const currencyMap: Record<string, { currency: string; multiplier: number }> = {
    'TR': { currency: 'TRY', multiplier: 1 },
    'US': { currency: 'USD', multiplier: 0.037 }, // 1 TRY = 0.037 USD
    'GB': { currency: 'GBP', multiplier: 0.030 },
    'DE': { currency: 'EUR', multiplier: 0.034 },
    'FR': { currency: 'EUR', multiplier: 0.034 },
    'ES': { currency: 'EUR', multiplier: 0.034 },
    'IT': { currency: 'EUR', multiplier: 0.034 }
  };
  
  const localization = currencyMap[countryCode] || currencyMap['TR'];
  
  return {
    price: Math.round(plan.price * localization.multiplier * 100) / 100,
    currency: localization.currency
  };
};
