import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import SizeSelector from './SizeSelector';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/ticker';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [sizeSelectorOpen, setSizeSelectorOpen] = useState(false);

  // Parse sizes safely
  let sizes = [];
  if (product && product.sizes) {
    if (Array.isArray(product.sizes)) {
      sizes = product.sizes;
    } else if (typeof product.sizes === 'string') {
      try {
        const cleaned = product.sizes.replace(/'/g, '"');
        sizes = JSON.parse(cleaned);
      } catch {
        sizes = product.sizes.split(',').map((s) => s.trim());
      }
    }
  }

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Stop click from bubbling and navigating to details
    setSizeSelectorOpen(true);
  };

  const handleSelectSize = async (selectedSize) => {
    setSizeSelectorOpen(false);
    await addToCart(product.id, 1, selectedSize);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="group ios-glass rounded-[20px] overflow-hidden flex flex-col"
      >
        <Link
          to={`/product/${product.id}`}
          className="block focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          {/* Image area */}
          <div className="relative aspect-square w-full bg-black/20 overflow-hidden">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
              alt={product.name || product.title || 'Sneaker'}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Quick-add button overlay — top-right, visible on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleQuickAdd}
                className="bg-brand-accent text-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
                title="Quick Add to Cart"
              >
                <FiPlus className="w-5 h-5 font-black" />
              </button>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4 flex flex-col gap-2">
            {/* Brand eyebrow */}
            <span className="text-[10px] font-black tracking-widest text-brand-accent uppercase">
              {product.brand || 'Sneakers'}
            </span>

            {/* Product name */}
            <h3 className="text-sm font-bold text-white line-clamp-2">
              {product.name || product.title}
            </h3>

            {/* Market stats row */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-500 uppercase tracking-wider">Last Sale</span>
                <span className="text-base font-black text-white">
                  {formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0)}
                </span>
              </div>

              {/* Movement chip — static visual indicator */}
              <span className="text-emerald-400 bg-emerald-400/10 rounded-full px-2 py-0.5 text-[10px] font-bold">
                +2.1%
              </span>
            </div>

            {/* Size pills row */}
            {sizes.length > 0 && (
              <div className="flex gap-1 flex-wrap overflow-hidden h-5">
                {sizes.slice(0, 4).map((sz, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] text-neutral-400 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded"
                  >
                    US {sz}
                  </span>
                ))}
                {sizes.length > 4 && (
                  <span className="text-[9px] text-neutral-500 px-1 py-0.5">
                    +{sizes.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Size selector modal */}
      <SizeSelector
        isOpen={sizeSelectorOpen}
        onClose={() => setSizeSelectorOpen(false)}
        sizes={sizes}
        onSelectSize={handleSelectSize}
      />
    </>
  );
}
