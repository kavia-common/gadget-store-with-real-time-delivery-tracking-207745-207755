import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { CartService } from './services/cart.service';
import { formatMoney } from './utils/format';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Retro Gadget Store';

  /** Current year for footer display (avoid using `new Date()` in templates). */
  currentYear = new Date().getFullYear();

  constructor(public readonly cart: CartService) {}

  // Expose formatter for template
  formatMoney = formatMoney;
}
