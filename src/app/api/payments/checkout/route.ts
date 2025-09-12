import { NextRequest, NextResponse } from 'next/server';

// Stripe/Iyzico Payment Integration for Turkish Market
interface PaymentRequest {
  planId: string;
  annual: boolean;
  countryCode: string;
  userId: string;
  userEmail: string;
}

// Türkiye için Iyzico, diğer ülkeler için Stripe
export async function POST(request: NextRequest) {
  try {
    const {
      planId,
      annual,
      countryCode,
      userId,
      userEmail
    }: PaymentRequest = await request.json();

    // Ülke bazlı ödeme sağlayıcısı seçimi
    const paymentProvider = countryCode === 'TR' ? 'iyzico' : 'stripe';
    
    if (paymentProvider === 'iyzico') {
      return handleIyzicoCheckout({
        planId,
        annual,
        userId,
        userEmail,
        countryCode
      });
    } else {
      return handleStripeCheckout({
        planId,
        annual,
        userId,
        userEmail,
        countryCode
      });
    }
  } catch (error) {
    console.error('Payment checkout error:', error);
    return NextResponse.json(
      { error: 'Ödeme işlemi başlatılamadı' },
      { status: 500 }
    );
  }
}

// GET endpoint for checkout URL generation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const planId = searchParams.get('plan');
  const annual = searchParams.get('annual') === 'true';
  const countryCode = searchParams.get('country') || 'TR';
  
  if (!planId) {
    return NextResponse.json({ error: 'Plan ID gerekli' }, { status: 400 });
  }

  // Mock checkout URL generation
  const checkoutUrl = generateCheckoutUrl({
    planId,
    annual,
    countryCode
  });

  return NextResponse.json({
    checkoutUrl,
    provider: countryCode === 'TR' ? 'iyzico' : 'stripe',
    planId,
    annual
  });
}

// Iyzico checkout handler (Türkiye)
const handleIyzicoCheckout = async (params: PaymentRequest) => {
  const { planId, annual, userId, userEmail } = params;
  
  // Plan fiyatlarını al
  const pricing = getPlanPricing(planId, annual, 'TR');
  
  // Iyzico checkout session oluştur
  const iyzicoPayment = {
    locale: 'tr',
    conversationId: userId,
    price: pricing.price.toString(),
    paidPrice: pricing.price.toString(),
    currency: 'TRY',
    installment: 1,
    basketId: `basket_${Date.now()}`,
    paymentChannel: 'WEB',
    paymentGroup: 'SUBSCRIPTION',
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback/iyzico`,
    buyer: {
      id: userId,
      name: 'AI HUB',
      surname: 'User',
      gsmNumber: '+905350000000',
      email: userEmail,
      identityNumber: '74300864791',
      registrationAddress: 'Türkiye',
      ip: '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: 'AI HUB User',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Türkiye',
      zipCode: '34732'
    },
    billingAddress: {
      contactName: 'AI HUB User',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Türkiye',
      zipCode: '34732'
    },
    basketItems: [
      {
        id: planId,
        name: `${planId.toUpperCase()} Plan ${annual ? '(Yıllık)' : '(Aylık)'}`,
        category1: 'Subscription',
        itemType: 'VIRTUAL',
        price: pricing.price.toString()
      }
    ]
  };

  // Mock Iyzico API response
  const checkoutFormUrl = `https://sandbox-cpp.iyzipay.com/api/payment/iyzipos/checkoutform/initialize/auth/eWYQpLEcMqw=`;
  
  return NextResponse.json({
    success: true,
    checkoutUrl: checkoutFormUrl,
    provider: 'iyzico',
    token: 'mock_iyzico_token',
    conversationId: userId
  });
};

// Stripe checkout handler (International)
const handleStripeCheckout = async (params: PaymentRequest) => {
  const { planId, annual, userId, userEmail, countryCode } = params;
  
  // Plan fiyatlarını al
  const pricing = getPlanPricing(planId, annual, countryCode);
  
  // Mock Stripe session
  const stripeSession = {
    id: `cs_mock_${Date.now()}`,
    url: `https://checkout.stripe.com/pay/cs_mock_${Date.now()}`,
    payment_method_types: ['card'],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?payment=cancelled`,
    customer_email: userEmail,
    metadata: {
      userId,
      planId,
      annual: annual.toString()
    }
  };

  return NextResponse.json({
    success: true,
    checkoutUrl: stripeSession.url,
    provider: 'stripe',
    sessionId: stripeSession.id
  });
};

// Plan fiyatlandırması helper
const getPlanPricing = (planId: string, annual: boolean, countryCode: string) => {
  const basePrices: Record<string, number> = {
    'basic': 29.99,
    'pro': 99.99,
    'enterprise': 499.99
  };

  let price = basePrices[planId] || 0;
  
  // Yıllık indirim
  if (annual) {
    price = price * 12 * 0.8; // %20 indirim
  }

  // Ülke bazlı fiyat ayarlaması
  const currencyMultipliers: Record<string, number> = {
    'TR': 27, // 1 USD = 27 TRY
    'US': 1,
    'GB': 0.8,
    'DE': 0.9,
    'FR': 0.9
  };

  const multiplier = currencyMultipliers[countryCode] || 1;
  return {
    price: Math.round(price * multiplier * 100) / 100,
    currency: countryCode === 'TR' ? 'TRY' : countryCode === 'GB' ? 'GBP' : countryCode === 'US' ? 'USD' : 'EUR'
  };
};

// Checkout URL generator
const generateCheckoutUrl = (params: { planId: string; annual: boolean; countryCode: string }) => {
  const { planId, annual, countryCode } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (countryCode === 'TR') {
    return `${baseUrl}/api/payments/iyzico-redirect?plan=${planId}&annual=${annual}`;
  } else {
    return `${baseUrl}/api/payments/stripe-redirect?plan=${planId}&annual=${annual}`;
  }
};
