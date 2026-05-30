# Implementation Plan: iOS Glassmorphism UI Redesign

## Overview

This plan implements the frontend-only iOS-glassmorphism redesign of the KICKS sneaker
marketplace in dependency order, exactly matching the design's layering:

1. **Layer 0 — Test tooling**: add Vitest + fast-check + @testing-library/react and
   verification scripts so pure-logic modules can be property-tested as they are built.
2. **Layer 1 — Design System** tokens & glass utilities in `src/index.css`.
3. **Layer 2 — Motion System** (`src/lib/motion.js`, `src/hooks/useReducedMotionPref.js`).
4. **Layer 3 — Shared components** re-themed onto the new primitives.
5. **Layer 4 — Hero composition** (`MarketStatPanel`, `PriceTicker`, `Hero`) + the pure
   `priceMovement` utility.
6. **Layer 5 — Pages** (`Page_Set`) re-skinned on the stable primitives.

Every task is scoped to file changes inside the `frontend` directory. The backend, the HTTP
API contract, and the request/response shapes in `src/services/api.js` are never modified
(Requirements 7.1–7.4). All implementation uses the existing stack: React 19, Vite, Tailwind
CSS v4, Framer Motion v12, React Router v7, react-hot-toast, react-icons (language: JavaScript/JSX,
as used throughout the design document).

## Tasks

- [x] 1. Set up test tooling and verification scripts
  - [x] 1.1 Add test runner, property-testing, and verification tooling
    - Add `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` as **devDependencies** in `frontend/package.json` (pinned versions); do not modify backend files
    - Add a `test` script (`vitest --run`) and a `test:watch` script to `package.json`
    - Create `frontend/vitest.config.js` (jsdom environment, globals, setup file) and `frontend/src/test/setup.js` (imports `@testing-library/jest-dom`)
    - Add a `check:no-neon` npm script that greps `src/**` for `#39ff14`, `brand-neon`, and `rgba(57, 255, 20` and fails on any match
    - _Requirements: 1.6, 8.5 (no-neon check); Testing Strategy (build/lint/PBT gates)_

- [x] 2. Establish the iOS glassmorphism Design System in `src/index.css`
  - [x] 2.1 Migrate color tokens to the electric-blue accent and add geometry/shadow/motion tokens
    - In the `@theme` block, remove `--color-brand-neon` / `--color-brand-neon-dim`; add the electric-blue accent scale (`--color-accent: #0a84ff`, `--color-accent-hover`, `--color-accent-strong`, `--color-accent-dim`, `--color-accent-glow`) and market status colors (`--color-market-up`, `--color-market-down`)
    - Add corner-radius tokens (`--radius-ios-sm`, `--radius-ios`, `--radius-ios-lg`), shadow tokens (`--shadow-glass`, `--shadow-glass-lg`), and motion-timing tokens (`--motion-fast`, `--motion-base`, `--motion-slow`, `--ease-ios`)
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 8.5_
  - [x] 2.2 Add glass surface utilities, the backdrop-filter fallback, and recolored accent utilities
    - Add `@utility` rules: `glass-card`, `glass-nav`, `ios-glass`, `ios-glass-heavy` (standardized blur radii) and the `@supports not (backdrop-filter ...)` opaque-fallback block
    - Recolor glow/text utilities from neon green to electric blue (`accent-glow`, `accent-text`, `ios-glow`), add `.text-gradient-accent`, and recolor the scrollbar thumb hover to `#0a84ff`; keep `ios-curve`/`ios-curve-lg` aliases during migration
    - _Requirements: 1.2, 1.3, 1.6, 1.7, 6.1_
  - [x] 2.3 Add the global `prefers-reduced-motion` stylesheet rules
    - Add the `@media (prefers-reduced-motion: reduce)` block that neutralizes decorative keyframes (`marquee-scroll`, `float`, `fade-slide-in`, etc.) and forces `.marquee-track` / `.animate-float` to their final, non-looping state
    - _Requirements: 3.4, 6.2_

- [x] 3. Build the Motion System
  - [x] 3.1 Create `src/lib/motion.js` with shared variants and the reduced-motion resolver
    - Export `EASE_IOS`, `DURATION`, and variants `fadeUp`, `staggerContainer`, `hoverLift`, `tapPress`, `heroReveal`, `pageTransition`, `REDUCED`
    - Export the pure resolver `getMotionVariants(variant, reduced)` returning `REDUCED` when `reduced` is true and the input variant otherwise
    - _Requirements: 2.4, 2.7, 3.1, 3.2, 3.3, 3.5_
  - [x] 3.2 Create `src/hooks/useReducedMotionPref.js`
    - Thin wrapper over Framer Motion's `useReducedMotion()` that returns a strict boolean to drive `getMotionVariants(...)`
    - _Requirements: 3.4, 6.2_
  - [x]* 3.3 Write property test for the reduced-motion resolver
    - **Property 1: Reduced-motion resolver yields a non-looping final state** (min 100 iterations, fast-check)
    - Assert that for any variant with `reduced = true` the result's `visible.opacity === 1`, has no transform offset, and a zero-duration transition; and for `reduced = false` the input variant is returned unchanged
    - **Validates: Requirements 2.7, 3.4, 6.2**

- [x] 4. Build the pure price-movement utility (`src/lib/priceMovement.js`)
  - [x] 4.1 Implement `formatPrice`, `formatChange`, `simulateTick`, and `deriveTickerEntries`
    - `formatPrice(value)` → `$`-prefixed grouped integer, NaN-safe; `formatChange(changePct)` → signed 2-decimal percent string
    - `simulateTick(prevChange, rng)` → finite next change bounded to `[-MAX_PCT, +MAX_PCT]`; `deriveTickerEntries(products, seed)` → at most `MAX_TICKER` identity-preserving `TickerEntry` objects (NaN-safe `basePrice`, bounded `changePct`), never throwing for string/array `sizes` or numeric-string `price`
    - Reads only existing product fields; performs no API calls and mutates no persisted data
    - _Requirements: 2.3, 7.3, 8.4_
  - [x]* 4.2 Write property test for `deriveTickerEntries`
    - **Property 2: Ticker derivation preserves product identity and is bounded** (min 100 iterations, fast-check)
    - Generate arbitrary `Product[]` (price as number or numeric string, sizes as string or array); assert no throw, length ≤ `MAX_TICKER`, every entry `id`/`title` originates from the input, finite `basePrice`, and `changePct` within `[-MAX_PCT, +MAX_PCT]`
    - **Validates: Requirements 2.3, 7.3, 8.4**
  - [x]* 4.3 Write property test for formatting and simulation invariants
    - **Property 3: Price/change formatting and movement simulation invariants** (min 100 iterations, fast-check)
    - Assert `formatChange` sign matches input sign; `simulateTick(prev, rng)` stays finite and within `[-MAX_PCT, +MAX_PCT]` for any `rng()` in `[0,1)`; `formatPrice` returns a `$`-prefixed grouped integer for any finite non-negative input
    - **Validates: Requirements 2.3, 8.4**

- [x] 5. Wire global motion and the toaster into the app shell
  - [x] 5.1 Update `src/App.jsx`
    - Wrap the app tree in `<MotionConfig reducedMotion="user">` and recolor the react-hot-toast toaster styling to the electric-blue accent (remove any neon-green values)
    - _Requirements: 1.6, 3.4, 6.2_
  - [x] 5.2 Update `src/layouts/MainLayout.jsx`
    - Apply route page-transition animation using the shared `pageTransition` variant from the motion system (animate outgoing/incoming page content)
    - _Requirements: 3.3_

- [x] 6. Re-theme shared components onto the Design System
  - [x] 6.1 Re-theme `src/components/Navbar.jsx`
    - Apply `glass-nav`/`ios-glass` surface and migrate all `brand-neon` usages to `accent` (cart badge `bg-accent`, glass profile dropdown); **fix the missing `toast` import used in `handleLogout`**; ensure icon buttons are ≥44×44px with visible focus rings
    - _Requirements: 1.3, 1.6, 4.2, 5.4, 6.3_
  - [x] 6.2 Re-theme `src/components/ProductCard.jsx` into the shared marketplace card
    - Brand eyebrow, name, last-sale price + movement chip (bid/ask density), accent quick-add; `rounded-ios`; `whileHover={hoverLift}`/`whileTap={tapPress}` from the motion system; set image `alt` derived from `product.title`; preserve existing `sizes` safe-parse logic
    - _Requirements: 3.1, 3.2, 4.5, 6.4, 8.1_
  - [x]* 6.3 Write property test for ProductCard alt text
    - **Property 4: Every product image has descriptive alternative text** (min 100 iterations, fast-check + Testing Library)
    - For any product with a non-empty `title`, assert the rendered image has a non-empty `alt` attribute derived from `title`
    - **Validates: Requirements 6.4**
  - [x] 6.4 Re-theme `src/components/SearchBar.jsx`
    - Glass/surface input with `focus:border-accent focus:ring-accent`; **fix icon class typos** (`h-5 h-5`→`h-5 w-5`, `h-4 h-4`→`h-4 w-4`)
    - _Requirements: 1.6, 4.3, 6.3_
  - [x] 6.5 Re-theme `src/components/BrandFilter.jsx`
    - Active pill `bg-accent text-black` + accent glow, ≥44px-tall pills, visible focus rings
    - _Requirements: 1.6, 5.4, 6.3_
  - [x] 6.6 Re-theme `src/components/SizeSelector.jsx`
    - `ios-glass-heavy` modal, accent selected size, focus rings, Esc/overlay close, ≥44px targets, Enter/Space activation
    - _Requirements: 1.6, 5.4, 6.3, 6.5_
  - [x] 6.7 Re-theme `src/components/CartItem.jsx`
    - Glass surface card, accent brand tag, ≥44px quantity controls, accent focus rings
    - _Requirements: 1.6, 4.1, 5.4_
  - [x] 6.8 Re-theme `src/components/Footer.jsx`
    - Glass/surface styling, accent link hovers, focus rings on links, newsletter input using Design_System input style
    - _Requirements: 1.6, 4.2, 4.3_
  - [x] 6.9 Re-theme `src/components/LoadingSkeleton.jsx`
    - Recolor shimmer to neutral glass tones (remove any green) and apply `rounded-ios` to match cards
    - _Requirements: 1.6, 4.5_

- [x] 7. Build the Hero composition
  - [x] 7.1 Create `src/components/MarketStatPanel.jsx`
    - `ios-glass-heavy rounded-ios-lg` bid/ask-style stat panel (`Last Sale`, `Bid`, `Ask`, `24h change`) derived from `product.price` via `priceMovement.js`, up/down colored with `market-up`/`market-down`; props `{ product, changePct }`; no API calls
    - _Requirements: 2.2, 8.1_
  - [x] 7.2 Create `src/components/PriceTicker.jsx`
    - Horizontal marquee of featured sneakers (brand, name, `formatPrice`, colored `formatChange` + chevron) using the `.marquee-track` keyframe; internal interval calls `simulateTick` (display-only) and is cleared on unmount
    - Derive entries via `deriveTickerEntries`; render nothing for an empty product list; when `useReducedMotionPref()` is true, render entries statically with no marquee translate and no interval updates; each cell is a focusable `Link` with keyboard activation
    - _Requirements: 2.3, 2.7, 3.4, 6.3, 6.5, 8.4_
  - [x] 7.3 Create `src/components/Hero.jsx`
    - Left column: "Live Market" eyebrow, display headline with `text-gradient-accent` word, subheading, primary CTA `Link to="/products"` (`bg-accent`, ≥44px height, accent-glow hover); right column: spotlit angled `hero_sneaker` with radial accent glow layered over `MarketStatPanel`; descriptive `alt`; embed `PriceTicker`
    - Entrance via `heroReveal` (completes ≤1200ms); under reduced motion render final state; headline + CTA never clip across breakpoints; consume `useProducts()` for featured items
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 5.5, 6.4, 8.3_
  - [x]* 7.4 Write unit tests for Hero and PriceTicker
    - Hero renders headline/subheading/CTA with `href="/products"` and navigates on activation; PriceTicker renders nothing for an empty product list; reduced-motion render shows a static ticker
    - _Requirements: 2.1, 2.3, 2.6, 2.7_

- [x] 8. Checkpoint - foundations, motion, utilities, and Hero
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Re-theme the Home page and integrate the Hero
  - [x] 9.1 Update `src/pages/Home.jsx`
    - Replace the inline hero with the new `Hero` component and `PriceTicker`; recolor ambient orbs to accent; migrate marquee, carousel, brand tabs, trust badges, and CTA banner to accent + glass surfaces; preserve existing data flow and `useProducts()` usage
    - _Requirements: 2.1, 2.3, 2.5, 4.1, 4.5, 8.3, 8.4_

- [x] 10. Re-theme the product browsing pages
  - [x] 10.1 Re-theme `src/pages/Products.jsx`
    - Marketplace grid header with result count, glass filter bar, shared `ProductCard`, accent active states; preserve existing hooks/`api.js` data flow
    - _Requirements: 4.1, 4.5, 8.1_
  - [x] 10.2 Re-theme `src/pages/ProductDetail.jsx`
    - Glass product stage, bid/ask `MarketStatPanel`-style stats block, accent size grid + add-to-cart, descriptive image alt; preserve existing data flow and `sizes` parsing
    - _Requirements: 4.1, 4.5, 6.4, 8.1_

- [x] 11. Re-theme the cart and checkout pages
  - [x] 11.1 Re-theme `src/pages/Cart.jsx`
    - Glass list using the re-themed `CartItem` and a glass order-summary panel
    - _Requirements: 4.1, 4.3_
  - [x] 11.2 Re-theme `src/pages/Checkout.jsx`
    - Design_System input styling, glass order summary, accent submit control with focus rings
    - _Requirements: 4.1, 4.3, 6.3_

- [x] 12. Re-theme the authentication pages
  - [x] 12.1 Re-theme `Login`, `Signup`, `VerifyEmail`, `ForgotPassword`, and `ResetPassword`
    - Apply `glass-card` form containers, Design_System inputs, accent CTAs and focus rings, and recolor glow orbs to accent across `src/pages/Login.jsx`, `Signup.jsx`, `VerifyEmail.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`; preserve existing auth data flow
    - _Requirements: 4.1, 4.3, 6.3_

- [x] 13. Re-theme the account and admin pages
  - [x] 13.1 Re-theme `src/pages/Orders.jsx`
    - Glass order cards, accent status chips, marketplace info density
    - _Requirements: 4.1_
  - [x] 13.2 Re-theme `src/pages/Profile.jsx`
    - Glass panels, Design_System inputs, accent controls with focus rings
    - _Requirements: 4.1, 4.3_
  - [x] 13.3 Re-theme `src/pages/Admin.jsx`
    - Glass tables/cards, accent primary actions, Design_System typography consistent with the rest of the Page_Set
    - _Requirements: 4.4_

- [x] 14. Final verification and integration gates
  - [x] 14.1 Run the repo-wide no-neon-green check and remediate
    - Run `npm run check:no-neon` (and a manual grep across `src/**` for `#39ff14`, `brand-neon`, `rgba(57, 255, 20`); fix any remaining references so the check returns zero matches
    - _Requirements: 1.5, 1.6, 8.5_
  - [x] 14.2 Run the build and lint gates and fix failures
    - Run `npm run build` (Vite) and `npm run lint` (ESLint); resolve broken imports from the token/component refactor and Hero extraction, and confirm the previously-missing `Navbar` `toast` import lints cleanly
    - _Requirements: 7.1, 7.4_
  - [x] 14.3 Run the full property and unit test suite and fix failures
    - Run `npm run test` (`vitest --run`); confirm Properties 1–4 (min 100 iterations each) and the Hero/PriceTicker unit tests pass
    - _Requirements: 2.7, 3.4, 6.2, 6.4, 2.3, 8.4_

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; all non-`*` tasks are required.
- Each task references the specific requirement sub-clauses and/or design properties it implements for traceability.
- Property-based tests (Properties 1–4) use **fast-check with a minimum of 100 iterations** and are tagged with a comment referencing the design property, e.g. `// Feature: ios-ui-redesign, Property 3: ...`.
- The design includes a Correctness Properties section, so property test sub-tasks are included; they are placed close to the pure-logic modules they validate (`motion.js`, `priceMovement.js`, `ProductCard`) to catch errors early.
- All file changes stay inside the `frontend` directory; the backend, the HTTP API contract, and `src/services/api.js` request/response shapes are never modified (Requirements 7.1–7.4).

### Manual Verification Checklist (non-code — perform after task 14)

Automation cannot meaningfully cover the visual/layout criteria. After the gates pass, manually verify in the browser/dev tools:

- **Responsive (5.1–5.5)**: mobile/tablet/desktop layouts; single-column mobile nav/grids; no horizontal overflow; hero headline + CTA never clip.
- **Touch targets (5.4)**: spot-measure interactive controls ≥ 44×44px at mobile widths.
- **Contrast (6.1)**: body text over each glass surface and over the opaque `@supports` fallback ≥ 4.5:1.
- **backdrop-filter fallback (1.7)**: emulate unsupported `backdrop-filter`; confirm opaque surfaces and legible text.
- **Keyboard & focus (6.3, 6.5)**: tab through Navbar, ProductCard, BrandFilter, SizeSelector, and forms; confirm visible focus rings and Enter/Space activation.
- **Reduced motion (2.7, 3.4, 6.2)**: enable OS "reduce motion"; confirm hero, marquee, ticker, and orbs render final state without looping.
- **Accent migration & consistency (1.5, 1.6, 4.1–4.5, 8.5)**: walk every page in the Page_Set; confirm electric-blue accent, glass surfaces, shared product card, and no neon-green anywhere.
- **Alt text (6.4)**: confirm hero sneaker and product images expose descriptive alternatives.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "4.1"] },
    { "id": 2, "tasks": ["2.3", "3.2", "3.3", "4.2", "4.3"] },
    { "id": 3, "tasks": ["5.1", "5.2", "6.1", "6.2", "6.4", "6.5", "6.6", "6.7", "6.8", "6.9", "7.1", "7.2"] },
    { "id": 4, "tasks": ["6.3", "7.3", "10.1", "10.2", "11.1", "11.2", "12.1", "13.1", "13.2", "13.3"] },
    { "id": 5, "tasks": ["7.4", "9.1"] },
    { "id": 6, "tasks": ["14.1"] },
    { "id": 7, "tasks": ["14.2"] },
    { "id": 8, "tasks": ["14.3"] }
  ]
}
```
