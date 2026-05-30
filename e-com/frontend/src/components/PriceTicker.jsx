import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { deriveTickerEntries, simulateTick, formatPrice, formatChange } from '../lib/ticker';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

/**
 * PriceTicker — live market-style horizontal scrolling price ticker.
 * Props: { products }
 *
 * - Derives up to 8 ticker entries from the products list.
 * - Simulates price ticks every 3 seconds (display-only, no API calls).
 * - Under reduced motion: renders entries in a static flex row (no marquee).
 * - Renders nothing when entries list is empty.
 * - Each cell is a focusable Link to /products/:id with keyboard activation.
 */
export default function PriceTicker({ products = [] }) {
  const prefersReduced = useReducedMotionPref();

  const [entries, setEntries] = useState(() => deriveTickerEntries(products, 8));

  // Re-derive entries when products change (derived state sync — intentional)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setEntries(deriveTickerEntries(products, 8)); // eslint-disable-line react-hooks/set-state-in-effect
  }, [products]);

  // Simulate price ticks every 3 seconds
  useEffect(() => {
    if (prefersReduced || entries.length === 0) return;

    const id = setInterval(() => {
      setEntries((prev) =>
        prev.map((entry) => {
          const newPrice = simulateTick(entry.price, entry.originalPrice);
          const change = newPrice - entry.originalPrice;
          return {
            ...entry,
            price: newPrice,
            change,
            changeLabel: formatChange(change, entry.originalPrice),
            priceLabel: formatPrice(newPrice),
            direction: change >= 0 ? 'up' : 'down',
          };
        })
      );
    }, 3000);

    return () => clearInterval(id);
  }, [prefersReduced, entries.length]);

  if (entries.length === 0) return null;

  // Reduced motion: static flex row, no marquee
  if (prefersReduced) {
    return (
      <div className="w-full overflow-hidden border-y border-white/5 bg-black/30 py-2">
        <div className="flex flex-row gap-0">
          {entries.map((entry) => (
            <TickerCell key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    );
  }

  // Normal mode: marquee with duplicated entries for seamless loop
  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-black/30 py-2">
      {/* Fade gradient — left edge */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{ background: 'linear-gradient(to right, #0a0a0a, transparent)' }}
        aria-hidden="true"
      />
      {/* Fade gradient — right edge */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
        style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }}
        aria-hidden="true"
      />

      {/* Marquee track — duplicated for seamless loop */}
      <div className="marquee-track flex flex-row gap-0" aria-label="Live price ticker">
        {entries.map((entry) => (
          <TickerCell key={`a-${entry.id}`} entry={entry} />
        ))}
        {/* Duplicate set for seamless infinite scroll */}
        {entries.map((entry) => (
          <TickerCell key={`b-${entry.id}`} entry={entry} aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual ticker cell — a Link to the product page.
 */
function TickerCell({ entry, 'aria-hidden': ariaHidden }) {
  const isUp = entry.direction === 'up';

  return (
    <Link
      to={`/products/${entry.id}`}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : undefined}
      className="
        flex items-center gap-2 px-5 py-1.5 border-r border-white/5
        text-sm whitespace-nowrap select-none
        hover:bg-white/5 transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-brand-accent
        rounded-sm
      "
    >
      {/* Brand name */}
      <span className="text-[10px] font-black tracking-widest uppercase text-neutral-500">
        {entry.brand || 'KICKS'}
      </span>

      {/* Price */}
      <span className="font-extrabold tabular-nums text-white">
        {entry.priceLabel || formatPrice(entry.price)}
      </span>

      {/* Change percentage with trend icon */}
      <span
        className={`flex items-center gap-0.5 text-xs font-bold tabular-nums ${
          isUp ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {isUp ? (
          <FiTrendingUp className="w-3 h-3 shrink-0" aria-hidden="true" />
        ) : (
          <FiTrendingDown className="w-3 h-3 shrink-0" aria-hidden="true" />
        )}
        {entry.changeLabel || formatChange(entry.change, entry.originalPrice)}
      </span>
    </Link>
  );
}
