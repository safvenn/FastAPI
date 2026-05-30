// Feature: ios-ui-redesign, Property 4: Every product image has descriptive alternative text
// Validates: Requirements 6.4

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';

// ─── Mocks (must be declared before component import) ────────────────────────

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addToCart: vi.fn() }),
}));

vi.mock('../components/SizeSelector', () => ({
  default: () => null,
}));

vi.mock('../hooks/useReducedMotionPref', () => ({
  useReducedMotionPref: vi.fn(() => false),
}));

// ─── Component import (after mocks) ──────────────────────────────────────────

import ProductCard from '../components/ProductCard';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Render ProductCard inside a MemoryRouter (required for react-router Links). */
function renderCard(product) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

/**
 * Returns the first <img> rendered by ProductCard.
 * ProductCard renders exactly one product image.
 */
function getProductImg() {
  return screen.getAllByRole('img')[0];
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Non-empty string (at least 1 printable character). */
const nonEmptyString = fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0);

/** Optional numeric price (number or numeric string). */
const arbitraryPrice = fc.oneof(
  fc.float({ min: 0, max: 10000, noNaN: true }),
  fc.nat(10000).map(String)
);

/** Optional sizes field (array or comma-separated string). */
const arbitrarySizes = fc.oneof(
  fc.array(fc.nat(20).map(String), { maxLength: 6 }),
  fc.constant(''),
  fc.constant(undefined)
);

// ─── Property 4 tests ─────────────────────────────────────────────────────────

describe('ProductCard — Property 4: Every product image has descriptive alternative text', () => {

  beforeEach(() => {
    // Clean up DOM between runs
  });

  // ── Sub-property 4a: product with a non-empty `name` ──────────────────────

  it('4a: for any product with a non-empty name, the img alt is non-empty', () => {
    fc.assert(
      fc.property(
        nonEmptyString,          // name
        arbitraryPrice,          // price
        arbitrarySizes,          // sizes
        (name, price, sizes) => {
          const product = { id: 1, name, price, sizes };
          const { unmount } = renderCard(product);
          const img = getProductImg();
          expect(img.getAttribute('alt')).toBeTruthy();
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Sub-property 4b: product with a non-empty `title` but no `name` ───────

  it('4b: for any product with a non-empty title (no name), the img alt is non-empty', () => {
    fc.assert(
      fc.property(
        nonEmptyString,          // title
        arbitraryPrice,          // price
        arbitrarySizes,          // sizes
        (title, price, sizes) => {
          // Explicitly omit `name` (or set it to empty/undefined) so the
          // component falls through to `product.title`.
          const product = { id: 2, name: '', title, price, sizes };
          const { unmount } = renderCard(product);
          const img = getProductImg();
          expect(img.getAttribute('alt')).toBeTruthy();
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Sub-property 4c: product with neither name nor title → fallback ────────

  it('4c: for a product with neither name nor title, the img alt falls back to "Sneaker"', () => {
    fc.assert(
      fc.property(
        arbitraryPrice,          // price
        arbitrarySizes,          // sizes
        (price, sizes) => {
          const product = { id: 3, name: '', title: '', price, sizes };
          const { unmount } = renderCard(product);
          const img = getProductImg();
          expect(img.getAttribute('alt')).toBe('Sneaker');
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Sub-property 4d: alt is always a non-empty string for any product ──────

  it('4d: the img alt is always a non-empty string regardless of product shape', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.nat(),
          name: fc.oneof(nonEmptyString, fc.constant(''), fc.constant(undefined)),
          title: fc.oneof(nonEmptyString, fc.constant(''), fc.constant(undefined)),
          price: arbitraryPrice,
          sizes: arbitrarySizes,
        }),
        (product) => {
          const { unmount } = renderCard(product);
          const img = getProductImg();
          const alt = img.getAttribute('alt');
          expect(typeof alt).toBe('string');
          expect(alt.length).toBeGreaterThan(0);
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

});
