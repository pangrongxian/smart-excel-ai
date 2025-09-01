/**
 * Creem Payment Client Configuration
 * Based on Creem API documentation: https://docs.creem.io
 */

interface CreemCheckoutRequest {
  product_id: string;
  customer_email?: string;
  customer_name?: string;
  success_url?: string;
  cancel_url?: string;
  return_url?: string;
  request_id?: string;
  metadata?: Record<string, any>;
}

interface CreemCheckoutResponse {
  checkout_url: string;
  checkout_id: string;
}

interface CreemSubscription {
  id: string;
  status: string;
  customer_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface CreemCustomer {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

class CreemClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, environment: 'test' | 'production' = 'test') {
    this.apiKey = apiKey;
    this.baseUrl = environment === 'production' 
      ? 'https://api.creem.io/v1' 
      : 'https://test-api.creem.io/v1'; // 修复：测试环境使用正确的端点
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Creem API Error: ${response.status} - ${errorData}`);
    }

    return response.json();
  }

  /**
   * Create a checkout session
   */
  async createCheckout(data: CreemCheckoutRequest): Promise<CreemCheckoutResponse> {
    return this.makeRequest<CreemCheckoutResponse>('/checkouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Retrieve a subscription
   */
  async getSubscription(subscriptionId: string): Promise<CreemSubscription> {
    return this.makeRequest<CreemSubscription>(`/subscriptions/${subscriptionId}`);
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<CreemSubscription> {
    return this.makeRequest<CreemSubscription>(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Retrieve a customer
   */
  async getCustomer(customerId: string): Promise<CreemCustomer> {
    return this.makeRequest<CreemCustomer>(`/customers/${customerId}`);
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

// Export singleton instance
export const creem = new CreemClient(
  process.env.CREEM_API_KEY as string,
  (process.env.CREEM_ENVIRONMENT as 'test' | 'production') || 'test'
);

export { CreemClient };
export type { CreemCheckoutRequest, CreemCheckoutResponse, CreemSubscription, CreemCustomer };