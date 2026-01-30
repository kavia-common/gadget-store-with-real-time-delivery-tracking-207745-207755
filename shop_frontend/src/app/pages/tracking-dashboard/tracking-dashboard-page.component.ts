import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';
import type { DeliveryEvent } from '../../models/shop.models';

@Component({
  selector: 'app-tracking-dashboard-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, AsyncPipe, DatePipe],
  templateUrl: './tracking-dashboard-page.component.html',
  styleUrl: './tracking-dashboard-page.component.css',
})
export class TrackingDashboardPageComponent implements OnInit, OnDestroy {
  trackingId = '';
  orderId?: number;

  filtered: DeliveryEvent[] = [];
  private sub?: Subscription;

  constructor(
    public readonly realtime: RealtimeService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    const trackingId = qp.get('trackingId');
    const orderId = qp.get('orderId');

    if (trackingId) this.trackingId = trackingId;
    if (orderId) this.orderId = Number(orderId);

    this.realtime.connect();

    if (this.trackingId) {
      this.realtime.subscribeToTracking(this.trackingId);
      this.bindFilter(this.trackingId);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    // Keep connection open for app lifetime; disconnecting here can be noisy when navigating.
  }

  apply(): void {
    const id = this.trackingId.trim();
    if (!id) return;
    this.realtime.subscribeToTracking(id);
    this.bindFilter(id);
  }

  private bindFilter(id: string): void {
    this.sub?.unsubscribe();
    this.sub = this.realtime.filteredEvents$(id).subscribe((events) => (this.filtered = events));
  }
}
