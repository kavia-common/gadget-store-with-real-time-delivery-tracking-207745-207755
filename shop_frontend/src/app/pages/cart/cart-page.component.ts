import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { formatMoney } from '../../utils/format';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  formatMoney = formatMoney;

  constructor(public readonly cart: CartService) {}

  inc(productId: number): void {
    const item = this.cart.itemsSnapshot.find((i) => i.product.id === productId);
    if (!item) return;
    this.cart.setQuantity(productId, item.quantity + 1);
  }

  dec(productId: number): void {
    const item = this.cart.itemsSnapshot.find((i) => i.product.id === productId);
    if (!item) return;
    this.cart.setQuantity(productId, Math.max(1, item.quantity - 1));
  }
}
