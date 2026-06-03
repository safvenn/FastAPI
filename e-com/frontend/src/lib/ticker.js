/**
 * src/lib/ticker.js
 * Pure utility functions for the market-style price ticker.
 * No side-effects, no imports — safe to unit/property-test in isolation.
 */

/**
 * Format a numeric price as a USD currency string.
 * @param {number} price
 * @returns {string}  e.g. "$245.00"
 */
export function formatPrice(price) {
  if (typeof price !== 'number' || !isFinite(price)) return '$—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format a price change as a signed percentage string.
 * @param {number} change  - absolute change in dollars
 * @param {number} base    - original price
 * @returns {string}  e.g. "+3.2%" or "-1.5%"
 */
export function formatChange(change, base) {
  if (typeof change !== 'number' || typeof base !== 'number' || base === 0) return '—';
  const pct = (change / base) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

/**
 * Simulate a single price tick — nudges the price by a small random delta.
 * Keeps the price within ±30% of the original.
 * @param {number} currentPrice
 * @param {number} originalPrice
 * @returns {number}  new price (rounded to nearest dollar)
 */
export function simulateTick(currentPrice, originalPrice) {
  if (typeof currentPrice !== 'number' || typeof originalPrice !== 'number') return currentPrice;
  const maxDelta = originalPrice * 0.02; // ±2% per tick
  const delta = (Math.random() * 2 - 1) * maxDelta;
  const next = currentPrice + delta;
  const floor = originalPrice * 0.7;
  const ceil  = originalPrice * 1.3;
  return Math.round(Math.min(Math.max(next, floor), ceil));
}

/**
 * Derive ticker entries from a product list.
 * Returns up to `limit` entries with id, name, brand, image, price, and change.
 * @param {Array<{id, name, brand, image_url, price}>} products
 * @param {number} [limit=6]
 * @returns {Array<{id, name, brand, image, price, originalPrice, change, changeLabel, priceLabel, direction}>}
 */
export function deriveTickerEntries(products, limit = 6) {
  if (!Array.isArray(products)) return [];
  return products.slice(0, limit).map((p) => {
    const originalPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
    // Simulate a small market movement for visual interest
    const delta = (Math.random() * 0.1 - 0.05) * originalPrice; // ±5%
    const currentPrice = Math.round(originalPrice + delta);
    const change = currentPrice - originalPrice;
    return {
      id: p.id,
      name: p.name || 'Unknown',
      brand: p.brand || '',
      image: p.image_url || p.image || '',
      price: currentPrice,
      originalPrice,
      change,
      changeLabel: formatChange(change, originalPrice),
      priceLabel: formatPrice(currentPrice),
      direction: change >= 0 ? 'up' : 'down',
    };
  });
}
