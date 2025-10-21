/**
 * Gumroad API Types
 */

export interface GumroadSubscriber {
  id: string;
  product_id: string;
  product_name: string;
  user_id: string;
  user_email: string;
  purchase_ids: string[];
  created_at: string;
  user_requested_cancellation_at: string | null;
  charge_occurrence_count: number | null;
  recurrence: string; // e.g., "monthly", "yearly"
  status: 'alive' | 'cancelled' | 'pending_cancellation' | 'pending_failure';
  ended_at: string | null;
  failed_at: string | null;
  free_trial_ends_at: string | null;
  license_key: string;
}

export interface GumroadSale {
  id: string;
  email: string;
  seller_id: string;
  timestamp: string;
  daystamp: string;
  created_at: string;
  product_name: string;
  product_id: string;
  product_permalink: string;
  formatted_display_price: string;
  formatted_total_price: string;
  currency_symbol: string;
  amount_refundable_in_currency: string;
  price: number;
  gumroad_fee: number;
  formatted_subtotal: string;
  subscription_id: string | null;
  is_recurring_billing: boolean;
  can_contact: boolean;
  is_gift_sender_purchase: boolean;
  is_gift_receiver_purchase: boolean;
  refunded: boolean;
  chargedback: boolean;
  disputed: boolean;
  dispute_won: boolean;
  purchase_email: string;
  license_key: string;
  quantity: number;
  shipping_information: Record<string, unknown> | null;
  is_shipping_required: boolean;
  card: {
    visual: string | null;
    type: string | null;
    bin: string | null;
    expiry_month: string | null;
    expiry_year: string | null;
  } | null;
}

export interface GumroadProduct {
  id: string;
  name: string;
  url: string;
  preview_url: string | null;
  description: string;
  customizable_price: boolean | null;
  require_shipping: boolean;
  published: boolean;
  custom_permalink: string | null;
  subscription_duration: string | null;
  custom_receipt: string | null;
  custom_fields: unknown[];
  sales_count: number;
  sales_usd_cents: number;
  is_tiered_membership: boolean;
  recurrences: string[] | null;
  variants: unknown[];
}

export interface GumroadApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface GumroadSubscribersResponse {
  success: boolean;
  subscribers: GumroadSubscriber[];
}

export interface GumroadSalesResponse {
  success: boolean;
  sales: GumroadSale[];
}

export interface GumroadConfig {
  accessToken: string;
}
