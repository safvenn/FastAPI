// Feature: ios-ui-redesign — Task 7.4
// Unit tests for Hero and PriceTicker components

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ─── Mock hooks ──────────────────────────────────────────────────────────────

// Hero uses useProducts internally (via parent, but Hero itself receives products as a prop).
// We mock useReducedMotionPref so framer-motion animations don't interfere.
vi.mock('../hooks/useReducedMotionPref', () => ({
  useReducedMotionPref: vi.fn(() => false),
}));

// ─── Imports (after mocks are declared) ──────────────────────────────────────

import { useReducedMotionPref } from '../hooks/useReducedMotionPref';
import Hero from '../components/Hero';
import PriceTicker from '../components/PriceTicker';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Minimal product shape that satisfies both Hero and PriceTicker. */
const makeProduct = (overrides = {}) => ({
  id: 1,
  name: 'Air Max 90',
  brand: 'Nike',
  price: 150,
  image_url: '',
  ...overrides,
});

/** Render a component wrapped in MemoryRouter (required for react-router Links). */
function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

// ─── Hero tests ───────────────────────────────────────────────────────────────

describe('Hero', () => {
  beforeEach(() => {
    // Default: no reduced motion
    useReducedMotionPref.mockReturnValue(false);
  });

  it('renders the "STEP INTO" headline text', () => {
    renderWithRouter(<Hero products={[]} />);
    expect(screen.getByText(/STEP INTO/i)).toBeInTheDocument();
  });

  it('renders the "THE FUTURE" headline text', () => {
    renderWithRouter(<Hero products={[]} />);
    expect(screen.getByText(/THE FUTURE/i)).toBeInTheDocument();
  });

  it('renders a primary CTA link pointing to /products', () => {
    renderWithRouter(<Hero products={[]} />);
    const shopLink = screen.getByRole('link', { name: /shop collection/i });
    expect(shopLink).toBeInTheDocument();
    expect(shopLink).toHaveAttribute('href', '/products');
  });

  it('CTA link is keyboard-activatable via Enter key', () => {
    renderWithRouter(<Hero products={[]} />);
    const shopLink = screen.getByRole('link', { name: /shop collection/i });

    // Links are natively keyboard-activatable; verify the element is focusable
    // and responds to keydown Enter without throwing.
    shopLink.focus();
    expect(document.activeElement).toBe(shopLink);

    // Firing Enter on a link should not throw
    expect(() => fireEvent.keyDown(shopLink, { key: 'Enter', code: 'Enter' })).not.toThrow();
  });
});

// ─── PriceTicker tests ────────────────────────────────────────────────────────

describe('PriceTicker', () => {
  beforeEach(() => {
    useReducedMotionPref.mockReturnValue(false);
  });

  it('renders nothing when given an empty product list', () => {
    const { container } = renderWithRouter(<PriceTicker products={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders ticker entries for a non-empty product list (reduced-motion static mode)', () => {
    // Force reduced motion so we get the simple static flex row (no marquee duplication)
    useReducedMotionPref.mockReturnValue(true);

    const products = [
      makeProduct({ id: 1, name: 'Air Max 90', brand: 'Nike', price: 150 }),
      makeProduct({ id: 2, name: 'Yeezy 350', brand: 'Adidas', price: 220 }),
    ];

    renderWithRouter(<PriceTicker products={products} />);

    // Each entry renders as a Link; there should be exactly 2 links (no duplication in static mode)
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
  });

  it('each ticker entry links to the correct product page', () => {
    useReducedMotionPref.mockReturnValue(true);

    const products = [
      makeProduct({ id: 42, brand: 'Nike', price: 100 }),
    ];

    renderWithRouter(<PriceTicker products={products} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/42');
  });
});
