import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import type { Address, Order } from '../../models/shop.models';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { formatMoney } from '../../utils/format';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent {
  formatMoney = formatMoney;

  placing = false;
  placedOrder: Order | null = null;
  error: string | null = null;

  address: Address = {
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  };

  constructor(
    public readonly cart: CartService,
    private readonly api: ApiService,
    private readonly router: Router,
  ) {}

  get canSubmit(): boolean {
    const a = this.address;
    return !!(a.fullName && a.email && a.line1 && a.city && a.postalCode && a.country) && this.cart.itemsSnapshot.length > 0;
  }

  async placeOrder(): Promise<void> {
    if (!this.canSubmit) return;

    try {
      this.placing = true;
      this.error = null;

      const items = this.cart.itemsSnapshot.map((it) => ({ productId: it.product.id, quantity: it.quantity }));
      this.placedOrder = await this.api.checkout({ items, shippingAddress: this.address });

      // Clear cart after "successful" checkout (even if backend fallback).
      this.cart.clear();
    } catch (e: any) {
      this.error = e?.message ?? 'Checkout failed.';
    } finally {
      this.placing = false;
    }
  }

  goToTracking(): void {
    if (!this.placedOrder?.trackingId) return;
    this.router.navigate(['/tracking'], { queryParams: { trackingId: this.placedOrder.trackingId, orderId: this.placedOrder.id } });
  }
}
