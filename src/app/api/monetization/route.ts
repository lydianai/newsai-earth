import { NextRequest, NextResponse } from 'next/server';

// API Rate Limiting and Monetization System
interface ApiUsage {
  userId: string;
  planId: string;
  requests: number;
  limit: number;
  resetDate: Date;
  overageCount: number;
}

interface RateLimitConfig {
  requests: number;
  windowMs: number;
  plan: string;
}

// Plan bazlı rate limit konfigürasyonları
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'free': {
    requests: 10, // Saatte 10 istek
    windowMs: 60 * 60 * 1000, // 1 saat
    plan: 'free'
  },
  'basic': {
    requests: 50, // Saatte 50 istek
    windowMs: 60 * 60 * 1000,
    plan: 'basic'
  },
  'pro': {
    requests: 500, // Saatte 500 istek
    windowMs: 60 * 60 * 1000,
    plan: 'pro'
  },
  'enterprise': {
    requests: 2000, // Saatte 2000 istek
    windowMs: 60 * 60 * 1000,
    plan: 'enterprise'
  }
};

// Memory-based rate limiting store (Üretimde Redis kullanılmalı)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
const checkRateLimit = (userId: string, planId: string): { allowed: boolean; remaining: number; resetTime: number } => {
  const config = RATE_LIMITS[planId] || RATE_LIMITS['free'];
  const key = `${userId}:${planId}`;
  const now = Date.now();
  
  const userLimit = rateLimitStore.get(key);
  
  // Zaman penceresi sıfırlandıysa yeni pencere başlat
  if (!userLimit || now > userLimit.resetTime) {
    const newResetTime = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime: newResetTime });
    return {
      allowed: true,
      remaining: config.requests - 1,
      resetTime: newResetTime
    };
  }
  
  // Limit kontrolü
  if (userLimit.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: userLimit.resetTime
    };
  }
  
  // İstek sayısını artır
  userLimit.count += 1;
  rateLimitStore.set(key, userLimit);
  
  return {
    allowed: true,
    remaining: config.requests - userLimit.count,
    resetTime: userLimit.resetTime
  };
};

// API endpoint handlers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const userId = searchParams.get('userId') || 'anonymous';
  const planId = searchParams.get('planId') || 'free';
  
  try {
    switch (action) {
      case 'check-limits':
        return handleCheckLimits(userId, planId);
        
      case 'usage-stats':
        return handleUsageStats(userId);
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Rate Limiting Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, planId, endpoint } = await request.json();
    
    switch (action) {
      case 'log-request':
        return handleLogRequest(userId, planId, endpoint);
        
      case 'upgrade-plan':
        return handleUpgradePlan(userId, planId);
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Monetization Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Rate limit kontrol handler
const handleCheckLimits = (userId: string, planId: string) => {
  const rateLimitResult = checkRateLimit(userId, planId);
  
  return NextResponse.json({
    allowed: rateLimitResult.allowed,
    remaining: rateLimitResult.remaining,
    resetTime: new Date(rateLimitResult.resetTime).toISOString(),
    plan: planId,
    upgradeRequired: !rateLimitResult.allowed && planId === 'free'
  });
};

// Kullanım istatistikleri handler
const handleUsageStats = (userId: string) => {
  // Mock data - gerçek uygulamada veritabanından gelecek
  const mockStats = {
    userId,
    currentMonth: {
      totalRequests: 1250,
      remainingRequests: 750,
      planLimit: 2000,
      overageRequests: 0
    },
    topEndpoints: [
      { endpoint: '/api/newsai', requests: 450, percentage: 36 },
      { endpoint: '/api/climateai', requests: 320, percentage: 25.6 },
      { endpoint: '/api/agricultureai', requests: 280, percentage: 22.4 },
      { endpoint: '/api/search', requests: 200, percentage: 16 }
    ],
    dailyUsage: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 100) + 20
    }))
  };
  
  return NextResponse.json(mockStats);
};

// İstek loglama handler
const handleLogRequest = (userId: string, planId: string, endpoint: string) => {
  const rateLimitResult = checkRateLimit(userId, planId);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded',
      message: 'API kullanım limitinizi aştınız. Lütfen planınızı yükseltin.',
      upgradeUrl: '/settings?tab=billing',
      resetTime: new Date(rateLimitResult.resetTime).toISOString()
    }, { status: 429 });
  }
  
  // İstek logla (gerçek uygulamada veritabanına kaydet)
  console.log(`API Request logged: ${userId} - ${endpoint} - Plan: ${planId}`);
  
  return NextResponse.json({
    success: true,
    remaining: rateLimitResult.remaining,
    resetTime: new Date(rateLimitResult.resetTime).toISOString(),
    charged: planId !== 'free'
  });
};

// Plan yükseltme handler
const handleUpgradePlan = (userId: string, newPlanId: string) => {
  // Mock upgrade process
  return NextResponse.json({
    success: true,
    message: 'Plan başarıyla yükseltildi',
    newPlan: newPlanId,
    newLimits: RATE_LIMITS[newPlanId],
    redirectUrl: '/settings?upgraded=true'
  });
};


