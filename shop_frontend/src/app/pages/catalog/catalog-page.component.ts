import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import type { Product } from '../../models/shop.models';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { formatMoney } from '../../utils/format';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css',
})
export class CatalogPageComponent implements OnInit {
  loading = true;
  error: string | null = null;
  products: Product[] = [];

  formatMoney = formatMoney;

  constructor(
    private readonly api: ApiService,
    public readonly cart: CartService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.products = await this.api.getProducts();
    } catch (e: any) {
      this.error = e?.message ?? 'Failed to load catalog.';
    } finally {
      this.loading = false;
    }
  }

  addToCart(p: Product): void {
    this.cart.add(p, 1);
  }
}
