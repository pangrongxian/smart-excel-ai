import { Role } from "@/types/user";

export interface Subscription {
  isPopular?: boolean;
  title: string;
  description: string;
  amount: number | string;
  expireType?: 'day' | 'week' | 'month' | 'year';
  possess: string[];
  mainClassName?: string;
  buttonClassName?: string;
  buttonText?: string;
};

export interface SubscribeInfo {
  [key: string]: Subscription;
};

export interface CreateCheckoutResponse {
  checkoutURL: string;
};

export interface SubScriptionInfo {
  subscriptionId: string | number;
  membershipExpire: number;
  customerId: string;
  variantId: number;
  role: Role;
  isCanceled?: boolean;
  updatePaymentMethodURL?: string;
  customerPortal?: string;
}

export type UpgradeType = 'subscription' | 'single';

export type VariantIdsByType = {
  [key in UpgradeType]: string;
};

// billing 页面显示的内容
export interface UserSubscriptionPlan extends SubScriptionInfo {
  name: string
  description: string
  isPro: boolean
}

// Creem 支付相关类型定义
// Creem payment related type definitions
export interface CreemCheckoutRequest {
  product_id: string;
  success_url: string;
  cancel_url: string;
  metadata?: {
    userId: string;
    email: string;
    username: string;
    type: UpgradeType;
    [key: string]: any;
  };
}

export interface CreemCheckoutResponse {
  checkout_url: string;
  checkout_id: string;
  expires_at: string;
}

export interface CreemSubscriptionURLPatch {
  url: string;
}

export interface CreemSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
  isActive: boolean;
  isCanceled: boolean;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  createdTime: number;
  endedTime: number;
  trialEnd: number;
  variantId: number;
}

export interface CreemSubscriptionStatus {
  isActive: boolean;
  isCanceled: boolean;
  currentPeriodEnd: number;
  variantId: number;
}

export interface CreemCustomer {
  id: string;
  email: string;
  name: string;
}

export interface CreemSubscription {
  id: string;
  customerId: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  userName: string;
  userEmail: string;
  status: string;
  statusFormatted: string;
  cardBrand: string;
  cardLastFour: string;
  pause: any;
  cancelled: boolean;
  trialEndsAt: string;
  billingAnchor: number;
  urls: {
    updatePaymentMethod: string;
    customerPortal: string;
  };
  renewsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  testMode: boolean;
}
export interface CreemWebhookPayload {
  event_type: 'payment.succeeded' | 'subscription.created' | 'subscription.updated' | 'subscription.cancelled';
  data: {
    id: string;
    type: 'payment' | 'subscription';
    attributes: any;
    metadata?: Record<string, any>;
  };
  created_at: string;
}

// 通用支付响应接口
export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// 支付提供商类型
// Payment provider type
export type PaymentProvider = 'lemonsqueezy' | 'creem';
