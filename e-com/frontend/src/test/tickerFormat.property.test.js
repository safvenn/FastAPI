// Feature: ios-ui-redesign, Property 3: Price/change formatting and movement simulation invariants

/**
 * Property-based tests for formatPrice, formatChange, and simulateTick.
 * Validates: Requirements 4.3
 *
 * Framework: vitest + fast-check (min 100 iterations per property)
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatPrice, formatChange, simulateTick } from '../lib/ticker.js';

// ─── Shared arbitraries ────────────────────────────────────────────────────────

/** Any finite, non-negative number (including 0) */
const finiteNonNegative = fc.float({ min: Math.fround(0), max: Math.fround(1_000_000), noNaN: true, noDefaultInfinity: true });

/** Any finite number (positive or negative) */
const finiteNumber = fc.float({ min: Math.fround(-1_000_000), max: Math.fround(1_000_000), noNaN: true, noDefaultInfinity: true });

/** A strictly positive finite number suitable as a price base */
const positivePrice = fc.float({ min: Math.fround(1), max: Math.fround(1_000_000), noNaN: true, noDefaultInfinity: true });

// ─── formatPrice ──────────────────────────────────────────────────────────────

describe('formatPrice – property tests', () => {
  it('returns a string starting with "$" for any finite non-negative number', () => {
    fc.assert(
      fc.property(finiteNonNegative, (price) => {
        const result = formatPrice(price);
        expect(typeof result).toBe('string');
        expect(result.startsWith('$')).toBe(true);
        // Must NOT be the sentinel value
        expect(result).not.toBe('$—');
      }),
      { numRuns: 100 }
    );
  });

  it('returns "$—" for NaN', () => {
    expect(formatPrice(NaN)).toBe('$—');
  });

  it('returns "$—" for positive Infinity', () => {
    expect(formatPrice(Infinity)).toBe('$—');
  });

  it('returns "$—" for negative Infinity', () => {
    expect(formatPrice(-Infinity)).toBe('$—');
  });

  it('returns "$—" for non-number inputs (property)', () => {
    const nonNumbers = fc.oneof(
      fc.string(),
      fc.boolean(),
      fc.constant(null),
      fc.constant(undefined),
      fc.array(fc.integer())
    );
    fc.assert(
      fc.property(nonNumbers, (val) => {
        expect(formatPrice(val)).toBe('$—');
      }),
      { numRuns: 100 }
    );
  });
});

// ─── formatChange ─────────────────────────────────────────────────────────────

describe('formatChange – property tests', () => {
  it('returns "—" when base is 0', () => {
    fc.assert(
      fc.property(finiteNumber, (change) => {
        expect(formatChange(change, 0)).toBe('—');
      }),
      { numRuns: 100 }
    );
  });

  it('result starts with "+" when change is strictly positive', () => {
    // change > 0, base > 0  →  pct > 0  →  sign "+"
    const positiveChange = fc.float({ min: Math.fround(0.01), max: Math.fround(1_000_000), noNaN: true, noDefaultInfinity: true });
    fc.assert(
      fc.property(positiveChange, positivePrice, (change, base) => {
        const result = formatChange(change, base);
        expect(result.startsWith('+')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('result starts with "-" when change is strictly negative', () => {
    // change < 0, base > 0  →  pct < 0  →  sign "-"
    const negativeChange = fc.float({ min: Math.fround(-1_000_000), max: Math.fround(-0.01), noNaN: true, noDefaultInfinity: true });
    fc.assert(
      fc.property(negativeChange, positivePrice, (change, base) => {
        const result = formatChange(change, base);
        expect(result.startsWith('-')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('result starts with "+" when change is zero (0% change)', () => {
    fc.assert(
      fc.property(positivePrice, (base) => {
        const result = formatChange(0, base);
        // 0 / base = 0, pct >= 0 → sign "+"
        expect(result.startsWith('+')).toBe(true);
        expect(result).toBe('+0.0%');
      }),
      { numRuns: 100 }
    );
  });

  it('returns "—" for non-number change or base', () => {
    expect(formatChange('x', 100)).toBe('—');
    expect(formatChange(10, 'y')).toBe('—');
    expect(formatChange(null, 100)).toBe('—');
  });
});

// ─── simulateTick ─────────────────────────────────────────────────────────────

describe('simulateTick – property tests', () => {
  it('result is always a finite integer', () => {
    fc.assert(
      fc.property(positivePrice, positivePrice, (currentPrice, originalPrice) => {
        const result = simulateTick(currentPrice, originalPrice);
        expect(typeof result).toBe('number');
        expect(isFinite(result)).toBe(true);
        expect(Number.isInteger(result)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('result stays within ±30% of originalPrice', () => {
    fc.assert(
      fc.property(positivePrice, positivePrice, (currentPrice, originalPrice) => {
        const result = simulateTick(currentPrice, originalPrice);
        const floor = originalPrice * 0.7;
        const ceil  = originalPrice * 1.3;
        expect(result).toBeGreaterThanOrEqual(Math.round(floor));
        expect(result).toBeLessThanOrEqual(Math.round(ceil));
      }),
      { numRuns: 100 }
    );
  });

  it('result is within ±30% even when currentPrice starts far outside the band', () => {
    // currentPrice deliberately set way above the ceiling
    fc.assert(
      fc.property(positivePrice, (originalPrice) => {
        const farAbove = originalPrice * 5;
        const result = simulateTick(farAbove, originalPrice);
        const floor = originalPrice * 0.7;
        const ceil  = originalPrice * 1.3;
        expect(result).toBeGreaterThanOrEqual(Math.round(floor));
        expect(result).toBeLessThanOrEqual(Math.round(ceil));
      }),
      { numRuns: 100 }
    );
  });

  it('returns currentPrice unchanged when inputs are not numbers', () => {
    expect(simulateTick('abc', 100)).toBe('abc');
    expect(simulateTick(null, 100)).toBe(null);
  });
});
