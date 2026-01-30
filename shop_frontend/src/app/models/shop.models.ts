/**
 * Shared domain models for the gadget store frontend.
 */

export type OrderStatus =
  | 'PLACED'
  | 'PAID'
  | 'PACKING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Product {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  fullName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  priceCents: number;
  quantity: number;
}

export interface Order {
  id: number;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  totalCents: number;
  trackingId?: string;
  shippingAddress: Address;
}

export interface DeliveryEvent {
  trackingId: string;
  orderId: number;
  status: OrderStatus;
  message: string;
  timestamp: string;
  eta?: string;
  lat?: number;
  lng?: number;
}
