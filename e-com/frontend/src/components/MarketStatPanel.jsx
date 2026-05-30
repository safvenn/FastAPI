import { useMemo } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatPrice, formatChange } from '../lib/ticker';

/**
 * MarketStatPanel — displays bid/ask-style market statistics for a featured product.
 * Props: { product, changePct }
 * No API calls — derives all values from the product prop.
 */
export default function MarketStatPanel({ product, changePct = 0 }) {
  const stats = useMemo(() => {
    if (!product) return null;
    const base = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
    const lastSale = Math.round(base * (1 + changePct / 100));
    const bid = Math.round(lastSale * 0.97);
    const ask = Math.round(lastSale * 1.03);
    const change = lastSale - base;
    const isUp = change >= 0;
    return { base, lastSale, bid, ask, change, isUp, changeLabel: formatChange(change, base) };
  }, [product, changePct]);

  if (!stats) return null;

  const productName = product.name || product.title || '';

  return (
    <div className="ios-glass-heavy rounded-[28px] p-5 space-y-4 min-w-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
          Market Stats
        </span>
        <span
          className={`flex items-center gap-1 text-xs font-bold ${
            stats.isUp ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {stats.isUp ? (
            <FiTrendingUp className="w-3.5 h-3.5" />
          ) : (
            <FiTrendingDown className="w-3.5 h-3.5" />
          )}
          {stats.changeLabel}
        </span>
      </div>

      {/* 2×2 stats grid: Last Sale, 24h Change, Bid, Ask */}
      <div className="grid grid-cols-2 gap-3">
        {/* Last Sale */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Last Sale</p>
          <p className="text-lg font-black tabular-nums text-white">
            {formatPrice(stats.lastSale)}
          </p>
        </div>

        {/* 24h Change */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">24h Change</p>
          <p
            className={`text-lg font-black tabular-nums ${
              stats.isUp ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {stats.changeLabel}
          </p>
        </div>

        {/* Bid */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Bid</p>
          <p className="text-base font-bold tabular-nums text-neutral-300">
            {formatPrice(stats.bid)}
          </p>
        </div>

        {/* Ask */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Ask</p>
          <p className="text-base font-bold tabular-nums text-neutral-300">
            {formatPrice(stats.ask)}
          </p>
        </div>
      </div>

      {/* Divider + product brand & name */}
      {productName && (
        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] text-neutral-600 truncate">
            {product.brand && (
              <span className="text-brand-accent">{product.brand} · </span>
            )}
            {productName}
          </p>
        </div>
      )}
    </div>
  );
}
