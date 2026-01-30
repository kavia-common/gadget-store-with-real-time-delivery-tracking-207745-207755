import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { CartItem, Product } from '../models/shop.models';

const STORAGE_KEY = 'retro_gadget_store_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items$ = new BehaviorSubject<CartItem[]>(this.load());
  readonly items$ = this._items$.asObservable();

  get itemsSnapshot(): CartItem[] {
    return this._items$.value;
  }

  get totalCents(): number {
    return this.itemsSnapshot.reduce((sum, it) => sum + it.product.priceCents * it.quantity, 0);
  }

  add(product: Product, quantity = 1): void {
    const items = [...this.itemsSnapshot];
    const idx = items.findIndex((i) => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ product, quantity });
    }
    this.persist(items);
  }

  remove(productId: number): void {
    const items = this.itemsSnapshot.filter((i) => i.product.id !== productId);
    this.persist(items);
  }

  setQuantity(productId: number, quantity: number): void {
    const q = Math.max(1, Math.floor(quantity));
    const items = this.itemsSnapshot.map((i) => (i.product.id === productId ? { ...i, quantity: q } : i));
    this.persist(items);
  }

  clear(): void {
    this.persist([]);
  }

  private persist(items: CartItem[]): void {
    this._items$.next(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage failures (private mode, SSR, etc.)
    }
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
