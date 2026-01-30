import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { Order } from '../../models/shop.models';
import { ApiService } from '../../services/api.service';
import { formatMoney } from '../../utils/format';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css',
})
export class OrdersPageComponent implements OnInit {
  loading = true;
  orders: Order[] = [];
  error: string | null = null;

  formatMoney = formatMoney;

  constructor(private readonly api: ApiService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.orders = await this.api.getOrders();
    } catch (e: any) {
      this.error = e?.message ?? 'Failed to load orders.';
    } finally {
      this.loading = false;
    }
  }
}
