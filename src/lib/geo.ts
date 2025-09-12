// AI NEWS - HUB Coğrafi Konum ve Dil Sistemi
export interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  currency: string;
  language: string;
  preferredLocale: string;
}

// Ülke koduna göre varsayılan dil ayarları
const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  'TR': 'tr', // Türkiye
  'US': 'en', // ABD
  'GB': 'en', // Birleşik Krallık
  'DE': 'de', // Almanya
  'FR': 'fr', // Fransa
  'ES': 'es', // İspanya
  'IT': 'it', // İtalya
  'RU': 'ru', // Rusya
  'CN': 'zh', // Çin
  'JP': 'ja', // Japonya
  'KR': 'ko', // Güney Kore
  'AR': 'ar', // Arjantin/Arapça ülkeler
  'BR': 'pt', // Brezilya
  'MX': 'es', // Meksika
  'CA': 'en', // Kanada (varsayılan İngilizce)
  'AU': 'en', // Avustralya
  'IN': 'en', // Hindistan
  'SA': 'ar', // Suudi Arabistan
  'AE': 'ar', // BAE
  'EG': 'ar', // Mısır
  'NG': 'en', // Nijerya
  'ZA': 'en', // Güney Afrika
};

// Desteklenen diller listesi
export const SUPPORTED_LANGUAGES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'pt'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Varsayılan dil
export const DEFAULT_LANGUAGE: SupportedLanguage = 'tr';

/**
 * IP adresinden coğrafi konum bilgilerini al
 */
export async function getGeoDataFromIP(ip?: string): Promise<GeoData> {
  try {
    // Ücretsiz IP geolocation servisleri
    const services = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://ipinfo.io/json',
    ];

    for (const service of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(service, {
          headers: {
            'User-Agent': 'AI-NEWS-HUB/1.0'
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Farklı servislerin farklı formatları için normalize et
        let countryCode = '';
        let country = '';
        let city = '';
        let region = '';
        let timezone = '';
        
        if (service.includes('ipapi.co')) {
          countryCode = data.country_code || 'TR';
          country = data.country_name || 'Turkey';
          city = data.city || '';
          region = data.region || '';
          timezone = data.timezone || '';
        } else if (service.includes('ip-api.com')) {
          countryCode = data.countryCode || 'TR';
          country = data.country || 'Turkey';
          city = data.city || '';
          region = data.regionName || '';
          timezone = data.timezone || '';
        } else if (service.includes('ipinfo.io')) {
          countryCode = data.country || 'TR';
          country = data.country || 'Turkey';
          city = data.city || '';
          region = data.region || '';
          timezone = data.timezone || '';
        }

        const language = COUNTRY_LANGUAGE_MAP[countryCode] || DEFAULT_LANGUAGE;
        
        return {
          country,
          countryCode,
          region,
          city,
          timezone,
          currency: getCurrencyForCountry(countryCode),
          language,
          preferredLocale: `${language}-${countryCode}`,
        };
      } catch (serviceError) {
        console.warn(`Geo service ${service} failed:`, serviceError);
        continue;
      }
    }
  } catch (error) {
    console.error('IP geolocation failed:', error);
  }

  // Varsayılan olarak Türkiye döndür
  return {
    country: 'Turkey',
    countryCode: 'TR',
    region: 'Istanbul',
    city: 'Istanbul',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    language: 'tr',
    preferredLocale: 'tr-TR',
  };
}

/**
 * Ülke koduna göre para birimi al
 */
function getCurrencyForCountry(countryCode: string): string {
  const currencyMap: Record<string, string> = {
    'TR': 'TRY',
    'US': 'USD',
    'GB': 'GBP',
    'DE': 'EUR',
    'FR': 'EUR',
    'ES': 'EUR',
    'IT': 'EUR',
    'RU': 'RUB',
    'CN': 'CNY',
    'JP': 'JPY',
    'KR': 'KRW',
    'AR': 'ARS',
    'BR': 'BRL',
    'MX': 'MXN',
    'CA': 'CAD',
    'AU': 'AUD',
    'IN': 'INR',
    'SA': 'SAR',
    'AE': 'AED',
    'EG': 'EGP',
  };
  
  return currencyMap[countryCode] || 'USD';
}

/**
 * Browser'dan dil tercihini al
 */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language || navigator.languages?.[0] || 'tr-TR';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  return SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage) 
    ? langCode as SupportedLanguage 
    : DEFAULT_LANGUAGE;
}

/**
 * Coğrafi konum ve browser tercihlerini birleştirerek en uygun dili belirle
 */
export async function detectOptimalLanguage(ip?: string): Promise<SupportedLanguage> {
  try {
    const [geoData, browserLang] = await Promise.all([
      getGeoDataFromIP(ip),
      Promise.resolve(getBrowserLanguage())
    ]);
    
    // Coğrafi konum dilini öncelik ver, browser dili yedek olarak kalsın
    const geoLang = geoData.language as SupportedLanguage;
    
    if (SUPPORTED_LANGUAGES.includes(geoLang)) {
      return geoLang;
    }
    
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }
    
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Language detection failed:', error);
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Dil koduna göre yerel ayarları al
 */
export function getLocaleSettings(language: SupportedLanguage) {
  const localeMap = {
    'tr': {
      name: 'Türkçe',
      flag: '🇹🇷',
      locale: 'tr-TR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'tr-TR',
      currency: 'TRY',
      rtl: false,
    },
    'en': {
      name: 'English',
      flag: '🇺🇸',
      locale: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'en-US',
      currency: 'USD',
      rtl: false,
    },
    'de': {
      name: 'Deutsch',
      flag: '🇩🇪',
      locale: 'de-DE',
      dateFormat: 'DD.MM.YYYY',
      numberFormat: 'de-DE',
      currency: 'EUR',
      rtl: false,
    },
    'fr': {
      name: 'Français',
      flag: '🇫🇷',
      locale: 'fr-FR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'fr-FR',
      currency: 'EUR',
      rtl: false,
    },
    'ar': {
      name: 'العربية',
      flag: '🇸🇦',
      locale: 'ar-SA',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'ar-SA',
      currency: 'SAR',
      rtl: true,
    },
    'zh': {
      name: '中文',
      flag: '🇨🇳',
      locale: 'zh-CN',
      dateFormat: 'YYYY/MM/DD',
      numberFormat: 'zh-CN',
      currency: 'CNY',
      rtl: false,
    },
    'ja': {
      name: '日本語',
      flag: '🇯🇵',
      locale: 'ja-JP',
      dateFormat: 'YYYY/MM/DD',
      numberFormat: 'ja-JP',
      currency: 'JPY',
      rtl: false,
    },
    'ru': {
      name: 'Русский',
      flag: '🇷🇺',
      locale: 'ru-RU',
      dateFormat: 'DD.MM.YYYY',
      numberFormat: 'ru-RU',
      currency: 'RUB',
      rtl: false,
    },
    'es': {
      name: 'Español',
      flag: '🇪🇸',
      locale: 'es-ES',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'es-ES',
      currency: 'EUR',
      rtl: false,
    },
    'pt': {
      name: 'Português',
      flag: '🇧🇷',
      locale: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'pt-BR',
      currency: 'BRL',
      rtl: false,
    },
    'it': {
      name: 'Italiano',
      flag: '🇮🇹',
      locale: 'it-IT',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'it-IT',
      currency: 'EUR',
      rtl: false,
    },
    'ko': {
      name: '한국어',
      flag: '🇰🇷',
      locale: 'ko-KR',
      dateFormat: 'YYYY.MM.DD',
      numberFormat: 'ko-KR',
      currency: 'KRW',
      rtl: false,
    },
  };
  
  return localeMap[language] || localeMap[DEFAULT_LANGUAGE];
}
