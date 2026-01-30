import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { DeliveryEvent, OrderStatus } from '../models/shop.models';

type WsState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private ws?: WebSocket;

  private readonly _state$ = new BehaviorSubject<WsState>('DISCONNECTED');
  readonly state$ = this._state$.asObservable();

  private readonly _events$ = new BehaviorSubject<DeliveryEvent[]>([]);
  readonly events$ = this._events$.asObservable();

  constructor(private readonly zone: NgZone) {}

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this._state$.next('CONNECTING');

    try {
      this.ws = new WebSocket(environment.wsUrl);

      this.ws.onopen = () => this.zone.run(() => this._state$.next('CONNECTED'));
      this.ws.onerror = () => this.zone.run(() => this._state$.next('ERROR'));
      this.ws.onclose = () => this.zone.run(() => this._state$.next('DISCONNECTED'));

      this.ws.onmessage = (msg) => {
        this.zone.run(() => {
          const parsed = this.safeParse(msg.data);
          if (!parsed) return;

          // Accept either a single event or an array of events.
          const events: DeliveryEvent[] = Array.isArray(parsed) ? parsed : [parsed];

          // Normalize minimal event shape.
          const normalized = events
            .map((e) => this.normalizeEvent(e))
            .filter((e): e is DeliveryEvent => !!e);

          if (normalized.length) {
            this._events$.next([...normalized, ...this._events$.value].slice(0, 200));
          }
        });
      };
    } catch {
      this._state$.next('ERROR');
    }
  }

  disconnect(): void {
    try {
      this.ws?.close();
    } finally {
      this.ws = undefined;
      this._state$.next('DISCONNECTED');
    }
  }

  /**
   * Subscribe to a tracking stream (if backend expects a message).
   * This is optional and backend-specific; safely no-ops when not connected.
   */
  subscribeToTracking(trackingId: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.ws.send(JSON.stringify({ type: 'subscribe', trackingId }));
    } catch {
      // ignore
    }
  }

  /**
   * Expose filtered stream by trackingId.
   */
  filteredEvents$(trackingId: string): Observable<DeliveryEvent[]> {
    return new Observable((subscriber) => {
      const sub = this.events$.subscribe((events) => {
        subscriber.next(events.filter((e) => e.trackingId === trackingId));
      });
      return () => sub.unsubscribe();
    });
  }

  private safeParse(data: any): any | null {
    if (data == null) return null;
    if (typeof data === 'object') return data;
    if (typeof data !== 'string') return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private normalizeEvent(input: any): DeliveryEvent | null {
    if (!input || typeof input !== 'object') return null;

    const trackingId = String(input.trackingId ?? input.tracking_id ?? '');
    const orderId = Number(input.orderId ?? input.order_id ?? 0);
    const status = String(input.status ?? 'SHIPPED') as OrderStatus;
    const message = String(input.message ?? input.note ?? 'Update received');
    const timestamp = String(input.timestamp ?? input.time ?? new Date().toISOString());

    if (!trackingId) return null;

    const evt: DeliveryEvent = {
      trackingId,
      orderId,
      status,
      message,
      timestamp,
      eta: input.eta ? String(input.eta) : undefined,
      lat: typeof input.lat === 'number' ? input.lat : undefined,
      lng: typeof input.lng === 'number' ? input.lng : undefined,
    };
    return evt;
  }
}
