/** Utility helpers (kept framework-agnostic). */

// PUBLIC_INTERFACE
export function formatMoney(priceCents: number): string {
  /** Formats cents into a retro-friendly USD string. */
  const dollars = (priceCents ?? 0) / 100;
  return dollars.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

// PUBLIC_INTERFACE
export function clamp(n: number, min: number, max: number): number {
  /** Clamp a number into [min, max]. */
  return Math.max(min, Math.min(max, n));
}
