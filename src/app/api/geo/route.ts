import { NextRequest, NextResponse } from 'next/server';
import { getGeoDataFromIP, detectOptimalLanguage } from '@/lib/geo';

export async function GET(request: NextRequest) {
  try {
    // IP adresini al - production'da real IP, development'da mock
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIP || '127.0.0.1';
    
    // Coğrafi konum verilerini al
    const [geoData, optimalLanguage] = await Promise.all([
      getGeoDataFromIP(ip),
      detectOptimalLanguage(ip)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        ...geoData,
        detectedLanguage: optimalLanguage,
        clientIP: ip,
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Geolocation API error:', error);
    
    // Hata durumunda varsayılan Türkiye bilgilerini döndür
    return NextResponse.json({
      success: false,
      error: 'Geolocation detection failed',
      data: {
        country: 'Turkey',
        countryCode: 'TR',
        region: 'Istanbul',
        city: 'Istanbul',
        timezone: 'Europe/Istanbul',
        currency: 'TRY',
        language: 'tr',
        preferredLocale: 'tr-TR',
        detectedLanguage: 'tr',
        clientIP: '127.0.0.1',
        timestamp: new Date().toISOString(),
      }
    }, { status: 200 });
  }
}
