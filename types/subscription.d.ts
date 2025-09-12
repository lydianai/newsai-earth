// Premium subscription types and interfaces
export interface SubscriptionPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  featuresEn: string[];
  apiRequestLimit: number;
  priority: number;
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiUsage {
  userId: string;
  planId: string;
  month: string; // YYYY-MM format
  requests: number;
  limit: number;
  resetDate: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_transfer' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  paidAt?: Date;
  createdAt: Date;
  invoiceUrl?: string;
}

export interface PremiumFeatureAccess {
  userId: string;
  features: {
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customReports: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    exportData: boolean;
    realTimeAlerts: boolean;
    multiLanguageSupport: boolean;
  };
  limits: {
    apiRequests: number;
    storageGB: number;
    teamMembers: number;
    customDashboards: number;
  };
}
