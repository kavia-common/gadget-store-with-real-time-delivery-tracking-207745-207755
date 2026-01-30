import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import type { Product } from '../../models/shop.models';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { formatMoney } from '../../utils/format';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.css',
})
export class ProductDetailsPageComponent implements OnInit {
  loading = true;
  product: Product | null = null;

  formatMoney = formatMoney;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
    private readonly cart: CartService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.product = await this.api.getProduct(id);
    this.loading = false;
  }

  addToCart(): void {
    if (!this.product) return;
    this.cart.add(this.product, 1);
  }
}
