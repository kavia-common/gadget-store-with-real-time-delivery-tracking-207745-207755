import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Order, Product } from '../models/shop.models';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pocket Laser Keyboard',
    description: 'Type like it’s 1987 — anywhere. Projects a keyboard onto any surface.',
    priceCents: 8999,
    imageUrl: '',
    category: 'Input',
    inStock: true,
    rating: 4.6,
  },
  {
    id: 2,
    name: 'CRT Glow Desk Lamp',
    description: 'A warm phosphor glow for maximum retro productivity. Low power, high vibe.',
    priceCents: 4599,
    imageUrl: '',
    category: 'Desk',
    inStock: true,
    rating: 4.3,
  },
  {
    id: 3,
    name: 'Cassette Bluetooth Adapter',
    description: 'Turn any tape deck into a wireless wonder. Pair, play, and rewind your worries.',
    priceCents: 1999,
    imageUrl: '',
    category: 'Audio',
    inStock: true,
    rating: 4.2,
  },
];

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Health check.
   */
  async getHealth(): Promise<any> {
    return firstValueFrom(this.http.get(`${environment.apiBase}/`).pipe(catchError((e) => of({ status: 'error', error: e }))));
  }

  /**
   * Product list.
   * If the backend doesn't support products yet, return a mock catalog so the UI stays functional.
   */
  async getProducts(): Promise<Product[]> {
    return firstValueFrom(
      this.http.get<Product[]>(`${environment.apiBase}/api/products`).pipe(
        catchError(() => of(MOCK_PRODUCTS)),
      ),
    );
  }

  /**
   * Product detail.
   */
  async getProduct(productId: number): Promise<Product | null> {
    return firstValueFrom(
      this.http.get<Product>(`${environment.apiBase}/api/products/${productId}`).pipe(
        catchError(() => of(MOCK_PRODUCTS.find((p) => p.id === productId) ?? null)),
      ),
    );
  }

  /**
   * Place an order (checkout).
   * If backend isn't ready, create a client-side "mock order" so Orders + Tracking can still demo end-to-end.
   */
  async checkout(payload: {
    items: { productId: number; quantity: number }[];
    shippingAddress: Order['shippingAddress'];
  }): Promise<Order> {
    const fallback: Order = {
      id: Math.floor(Math.random() * 90000) + 10000,
      createdAt: new Date().toISOString(),
      status: 'PLACED',
      items: payload.items.map((it) => {
        const prod = MOCK_PRODUCTS.find((p) => p.id === it.productId);
        return {
          productId: it.productId,
          name: prod?.name ?? `Product #${it.productId}`,
          priceCents: prod?.priceCents ?? 0,
          quantity: it.quantity,
        };
      }),
      totalCents: payload.items.reduce((sum, it) => {
        const prod = MOCK_PRODUCTS.find((p) => p.id === it.productId);
        return sum + (prod?.priceCents ?? 0) * it.quantity;
      }, 0),
      trackingId: `TRK-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
      shippingAddress: payload.shippingAddress,
    };

    return firstValueFrom(
      this.http.post<Order>(`${environment.apiBase}/api/checkout`, payload).pipe(
        catchError(() => of(fallback)),
      ),
    );
  }

  /**
   * List orders.
   */
  async getOrders(): Promise<Order[]> {
    return firstValueFrom(
      this.http.get<Order[]>(`${environment.apiBase}/api/orders`).pipe(
        catchError(() => of([])),
      ),
    );
  }

  /**
   * Get order by id.
   */
  async getOrder(orderId: number): Promise<Order | null> {
    return firstValueFrom(
      this.http.get<Order>(`${environment.apiBase}/api/orders/${orderId}`).pipe(
        catchError(() => of(null)),
      ),
    );
  }
}
