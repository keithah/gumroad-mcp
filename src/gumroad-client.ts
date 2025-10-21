import {
  GumroadConfig,
  GumroadSubscriber,
  GumroadSale,
  GumroadProduct,
  GumroadSubscribersResponse,
  GumroadSalesResponse,
  GumroadApiResponse,
} from './types.js';

export class GumroadClient {
  private baseUrl = 'https://api.gumroad.com/v2';
  private accessToken: string;

  constructor(config: GumroadConfig) {
    this.accessToken = config.accessToken;
  }

  /**
   * Make a GET request to the Gumroad API
   */
  private async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add access token to params
    url.searchParams.append('access_token', this.accessToken);

    // Add any additional params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gumroad API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get all subscribers for a specific product
   */
  async getSubscribers(productId: string): Promise<GumroadSubscriber[]> {
    const response = await this.get<GumroadSubscribersResponse>(
      `/products/${productId}/subscribers`
    );

    if (!response.success) {
      throw new Error('Failed to fetch subscribers');
    }

    return response.subscribers;
  }

  /**
   * Get details for a specific subscriber
   */
  async getSubscriber(subscriberId: string): Promise<GumroadSubscriber> {
    const response = await this.get<GumroadApiResponse<GumroadSubscriber>>(
      `/subscribers/${subscriberId}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch subscriber details');
    }

    return response.data;
  }

  /**
   * Get all sales (with optional filters)
   */
  async getSales(options?: {
    after?: string;    // ISO 8601 timestamp
    before?: string;   // ISO 8601 timestamp
    page?: number;
    email?: string;
  }): Promise<GumroadSale[]> {
    const params: Record<string, string> = {};

    if (options?.after) params.after = options.after;
    if (options?.before) params.before = options.before;
    if (options?.page) params.page = options.page.toString();
    if (options?.email) params.email = options.email;

    const response = await this.get<GumroadSalesResponse>('/sales', params);

    if (!response.success) {
      throw new Error('Failed to fetch sales');
    }

    return response.sales;
  }

  /**
   * Get details for a specific sale
   */
  async getSale(saleId: string): Promise<GumroadSale> {
    const response = await this.get<GumroadApiResponse<GumroadSale>>(
      `/sales/${saleId}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch sale details');
    }

    return response.data;
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<GumroadProduct[]> {
    const response = await this.get<{ success: boolean; products: GumroadProduct[] }>(
      '/products'
    );

    if (!response.success) {
      throw new Error('Failed to fetch products');
    }

    return response.products;
  }

  /**
   * Get a specific product
   */
  async getProduct(productId: string): Promise<GumroadProduct> {
    const response = await this.get<GumroadApiResponse<GumroadProduct>>(
      `/products/${productId}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch product details');
    }

    return response.data;
  }
}
