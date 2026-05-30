// Feature: ios-ui-redesign, Property 2: Ticker derivation preserves product identity and is bounded

/**
 * Property-based tests for `deriveTickerEntries` from `src/lib/ticker.js`.
 *
 * Validates: Requirements 2.3, 7.3, 8.4
 *
 * Properties verified (min 100 iterations each via fast-check):
 *   1. Never throws for any array input (price as number or numeric string,
 *      sizes as string or array)
 *   2. Result length is always <= MAX_TICKER (6)
 *   3. Every entry's id and name originates from the input product
 *   4. Every entry has a finite basePrice (originalPrice) and finite price
 *   5. direction is always 'up' or 'down'
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { deriveTickerEntries } from '../lib/ticker.js';

const MAX_TICKER = 6;

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** A price value that mirrors real-world API shapes: number or numeric string */
const arbPrice = fc.oneof(
  fc.float({ min: 0, max: 10_000, noNaN: true }),
  fc.integer({ min: 0, max: 10_000 }).map(String),
  fc.constant(''),          // empty string — NaN-safe path
  fc.constant(null),        // missing price
  fc.constant(undefined),
);

/** sizes can be a JSON-ish string, an array of strings, or absent */
const arbSizes = fc.oneof(
  fc.array(fc.string({ maxLength: 6 }), { maxLength: 10 }),
  fc.string({ maxLength: 40 }),
  fc.constant(null),
  fc.constant(undefined),
);

/** A single product matching the existing API shape */
const arbProduct = fc.record({
  id: fc.integer({ min: 1, max: 1_000_000 }),
  name: fc.oneof(fc.string({ minLength: 1, maxLength: 80 }), fc.constant(undefined)),
  brand: fc.oneof(fc.string({ maxLength: 40 }), fc.constant(undefined)),
  price: arbPrice,
  image_url: fc.oneof(fc.webUrl(), fc.constant(undefined)),
  sizes: arbSizes,
});

/** An arbitrary array of products (0–20 items) */
const arbProducts = fc.array(arbProduct, { minLength: 0, maxLength: 20 });

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

describe('deriveTickerEntries — property tests', () => {

  it('Property 2a: never throws for any array input', () => {
    fc.assert(
      fc.property(arbProducts, (products) => {
        expect(() => deriveTickerEntries(products)).not.toThrow();
      }),
      { numRuns: 100 },
    );
  });

  it('Property 2b: result length is always <= MAX_TICKER (6)', () => {
    fc.assert(
      fc.property(arbProducts, (products) => {
        const entries = deriveTickerEntries(products);
        expect(entries.length).toBeLessThanOrEqual(MAX_TICKER);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 2c: every entry id and name originates from the input product', () => {
    fc.assert(
      fc.property(arbProducts, (products) => {
        // deriveTickerEntries processes products in order via slice+map,
        // so each entry at index i corresponds to products[i].
        const limit = Math.min(products.length, MAX_TICKER);
        const entries = deriveTickerEntries(products);

        expect(entries.length).toBe(limit);

        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const source = products[i]; // positional correspondence (slice+map)

          // id must come from the source product at the same position
          expect(entry.id).toBe(source.id);

          // name must match: implementation uses `p.name || 'Unknown'`
          const expectedName = source.name || 'Unknown';
          expect(entry.name).toBe(expectedName);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('Property 2d: every entry has a finite originalPrice (basePrice)', () => {
    fc.assert(
      fc.property(arbProducts, (products) => {
        const entries = deriveTickerEntries(products);
        for (const entry of entries) {
          expect(typeof entry.originalPrice).toBe('number');
          expect(Number.isFinite(entry.originalPrice)).toBe(true);
          // price (current simulated price) must also be a finite number
          expect(typeof entry.price).toBe('number');
          expect(Number.isFinite(entry.price)).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('Property 2e: direction is always "up" or "down"', () => {
    fc.assert(
      fc.property(arbProducts, (products) => {
        const entries = deriveTickerEntries(products);
        for (const entry of entries) {
          expect(['up', 'down']).toContain(entry.direction);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('Property 2 (combined): all invariants hold simultaneously', () => {
    fc.assert(
      fc.property(arbProducts, (products) => {
        let entries;
        // 2a — no throw
        expect(() => { entries = deriveTickerEntries(products); }).not.toThrow();

        // 2b — bounded length
        expect(entries.length).toBeLessThanOrEqual(MAX_TICKER);

        // deriveTickerEntries uses slice(0, limit).map(...), so entry[i] == products[i]
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const source = products[i];

          // 2c — identity preserved (positional)
          expect(entry.id).toBe(source.id);
          expect(entry.name).toBe(source.name || 'Unknown');

          // 2d — finite prices
          expect(Number.isFinite(entry.originalPrice)).toBe(true);
          expect(Number.isFinite(entry.price)).toBe(true);

          // 2e — valid direction
          expect(['up', 'down']).toContain(entry.direction);
        }
      }),
      { numRuns: 100 },
    );
  });

  // Edge-case: empty array always returns empty array
  it('returns an empty array for an empty product list', () => {
    expect(deriveTickerEntries([])).toEqual([]);
  });

  // Edge-case: non-array input returns empty array (graceful)
  it('returns an empty array for non-array input', () => {
    expect(deriveTickerEntries(null)).toEqual([]);
    expect(deriveTickerEntries(undefined)).toEqual([]);
    expect(deriveTickerEntries('not-an-array')).toEqual([]);
  });

  // Edge-case: numeric-string price is handled without NaN
  it('handles numeric-string price without producing NaN in originalPrice', () => {
    const products = [{ id: 1, name: 'Air Max', price: '199.99' }];
    const [entry] = deriveTickerEntries(products);
    expect(Number.isFinite(entry.originalPrice)).toBe(true);
    expect(entry.originalPrice).toBeCloseTo(199.99, 1);
  });

  // Edge-case: sizes as string does not cause a throw
  it('handles sizes as a plain string without throwing', () => {
    const products = [{ id: 2, name: 'Jordan 1', price: 250, sizes: '["8","9","10"]' }];
    expect(() => deriveTickerEntries(products)).not.toThrow();
  });

  // Edge-case: sizes as array does not cause a throw
  it('handles sizes as an array without throwing', () => {
    const products = [{ id: 3, name: 'Yeezy', price: 300, sizes: ['8', '9', '10'] }];
    expect(() => deriveTickerEntries(products)).not.toThrow();
  });
});
