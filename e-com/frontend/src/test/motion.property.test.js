// Feature: ios-ui-redesign, Property 1: Reduced-motion resolver yields a non-looping final state
// Validates: Requirements 2.7, 3.4, 6.2

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getMotionVariants, REDUCED } from '../lib/motion.js';

// ─── Arbitrary: any plain object (represents an arbitrary motion variant) ────

/**
 * Generates an arbitrary object that could represent a Framer Motion variant.
 * We use fc.object() which produces arbitrary nested plain objects.
 */
const arbitraryVariant = fc.object();

describe('getMotionVariants — Property 1: Reduced-motion resolver', () => {

  it('when reduced=true, visible.opacity is always 1', () => {
    fc.assert(
      fc.property(arbitraryVariant, (variant) => {
        const result = getMotionVariants(variant, true);
        expect(result.visible.opacity).toBe(1);
      }),
      { numRuns: 100 }
    );
  });

  it('when reduced=true, transition.duration is always 0', () => {
    fc.assert(
      fc.property(arbitraryVariant, (variant) => {
        const result = getMotionVariants(variant, true);
        expect(result.visible.transition.duration).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it('when reduced=true, the result is always the REDUCED constant (same reference)', () => {
    fc.assert(
      fc.property(arbitraryVariant, (variant) => {
        const result = getMotionVariants(variant, true);
        expect(result).toBe(REDUCED);
      }),
      { numRuns: 100 }
    );
  });

  it('when reduced=false, the result is the exact same object reference as the input variant', () => {
    fc.assert(
      fc.property(arbitraryVariant, (variant) => {
        const result = getMotionVariants(variant, false);
        expect(result).toBe(variant);
      }),
      { numRuns: 100 }
    );
  });

  it('never throws for any object input regardless of reduced flag', () => {
    fc.assert(
      fc.property(arbitraryVariant, fc.boolean(), (variant, reduced) => {
        expect(() => getMotionVariants(variant, reduced)).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });

});
