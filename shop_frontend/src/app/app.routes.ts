import { Routes } from '@angular/router';
import { CatalogPageComponent } from './pages/catalog/catalog-page.component';
import { ProductDetailsPageComponent } from './pages/product-details/product-details-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page.component';
import { OrdersPageComponent } from './pages/orders/orders-page.component';
import { TrackingDashboardPageComponent } from './pages/tracking-dashboard/tracking-dashboard-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
  { path: 'catalog', component: CatalogPageComponent, title: 'Catalog • Retro Gadget Store' },
  { path: 'product/:id', component: ProductDetailsPageComponent, title: 'Product • Retro Gadget Store' },
  { path: 'cart', component: CartPageComponent, title: 'Cart • Retro Gadget Store' },
  { path: 'checkout', component: CheckoutPageComponent, title: 'Checkout • Retro Gadget Store' },
  { path: 'orders', component: OrdersPageComponent, title: 'Orders • Retro Gadget Store' },
  { path: 'tracking', component: TrackingDashboardPageComponent, title: 'Delivery Tracking • Retro Gadget Store' },
  { path: '**', redirectTo: 'catalog' },
];
