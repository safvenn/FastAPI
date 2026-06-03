/**
 * src/lib/motion.js
 * Centralised Framer Motion variants and animation helpers.
 * All components import from here — never define timing inline.
 * Requirements: 3.1–3.5, 2.4, 2.7
 */

// ─── Timing constants ────────────────────────────────────────────────────────

/** iOS-style easing curve (easeOutExpo-like). Mirrors --ease-ios in index.css. */
export const EASE_IOS = [0.22, 1, 0.36, 1];

/** Duration values in seconds. Mirror --motion-* tokens in index.css. */
export const DURATION = {
  fast: 0.12,  // hover state begins ≤100–120ms (Req 3.1)
  base: 0.3,   // standard transitions
  slow: 0.5,   // feedback animations complete ≤500ms (Req 3.2)
  hero: 0.8,   // hero entrance (completes ≤1200ms — Req 2.4)
};

// ─── Entrance variants ───────────────────────────────────────────────────────

/**
 * Fade + rise entrance — used by sections, cards, panels.
 * Requirements: 3.1, 3.5
 */
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_IOS } },
};

/**
 * Stagger container for grids/lists.
 * Requirements: 3.5
 */
export const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// ─── Micro-interaction variants ──────────────────────────────────────────────

/**
 * Hover lift — used with whileHover on cards and interactive elements.
 * State change begins within 100ms (Req 3.1).
 */
export const hoverLift = {
  scale: 1.02,
  transition: { duration: DURATION.fast, ease: EASE_IOS },
};

/**
 * Tap press — used with whileTap on buttons and cards.
 * Feedback animation completes within 500ms (Req 3.2).
 */
export const tapPress = {
  scale: 0.97,
  transition: { duration: DURATION.fast },
};

// ─── Hero entrance ───────────────────────────────────────────────────────────

/**
 * Hero section entrance animation.
 * Completes within 1200ms (Req 2.4).
 */
export const heroReveal = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.hero, ease: EASE_IOS } },
};

// ─── Page transition ─────────────────────────────────────────────────────────

/**
 * Route page-transition animation (Req 3.3).
 * Used by MainLayout to animate outgoing/incoming page content.
 */
export const pageTransition = {
  initial:    { opacity: 0, y: 6 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: 'easeOut' },
};

// ─── Reduced-motion final-state variants ─────────────────────────────────────

/**
 * Reduced-motion variant — no transform offset, instant transition.
 * Returned by getMotionVariants() when reduced = true (Req 3.4, 6.2, 2.7).
 */
export const REDUCED = {
  hidden:  { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

// ─── Reduced-motion resolver (pure, testable) ────────────────────────────────

/**
 * Returns the appropriate variant set based on the user's motion preference.
 *
 * Pure function — no side effects, no DOM access.
 * Property-tested in task 3.3 (Property 1).
 *
 * @param {object} variant  - The full animated variant (e.g. fadeUp, heroReveal)
 * @param {boolean} reduced - true when prefers-reduced-motion: reduce is active
 * @returns {object} Either the animated variant or the REDUCED final-state variant
 *
 * Requirements: 2.7, 3.4, 6.2
 */
export function getMotionVariants(variant, reduced) {
  return reduced ? REDUCED : variant;
}
