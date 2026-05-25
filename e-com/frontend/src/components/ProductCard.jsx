import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import SizeSelector from './SizeSelector';
import { useCart } from '../context/CartContext';

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
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4 }}
        className="group relative ios-glass rounded-[24px] overflow-hidden flex flex-col justify-between hover:scale-[1.02] hover:border-brand-neon/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300"
      >
        <Link to={`/product/${product.id}`} className="block">
          
          {/* Card Image Wrapper with hover zoom and premium blur layer */}
          <div className="relative aspect-square w-full bg-transparent flex items-center justify-center p-0 overflow-hidden">
            <motion.img
              src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Dark gradient shadow bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Quick action buttons overlay */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleQuickAdd}
                className="w-10 h-10 rounded-full bg-brand-neon hover:bg-brand-neon hover:scale-105 text-black flex items-center justify-center shadow-lg transition duration-200 cursor-pointer"
                title="Quick Add to Cart"
              >
                <FiPlus className="w-5 h-5 font-black" />
              </button>
            </div>
          </div>

          {/* Product description details */}
          <div className="p-5 flex-grow flex flex-col justify-between">
            <div>
              {/* Brand Tag */}
              <span className="text-[10px] font-extrabold tracking-widest text-brand-neon uppercase px-2 py-0.5 bg-brand-neon/10 rounded-md">
                {product.brand || 'Sneakers'}
              </span>
              
              {/* Product Title */}
              <h3 className="mt-3 text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-brand-neon transition-colors duration-200">
                {product.title}
              </h3>

              {/* Sneaker sizes preview pills */}
              {sizes.length > 0 && (
                <div className="flex gap-1 mt-2.5 flex-wrap overflow-hidden h-5">
                  {sizes.slice(0, 4).map((sz, idx) => (
                    <span key={idx} className="text-[9px] text-neutral-400 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
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

            {/* Price section and Detail navigation icon */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-base font-extrabold text-white">
                ${product.price || '180'}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                VIEW DETAIL <FiArrowRight className="w-3 h-3" />
              </span>
            </div>

          </div>

        </Link>
      </motion.div>

      {/* Render the Size selector modal if user initiates quick add */}
      <SizeSelector
        isOpen={sizeSelectorOpen}
        onClose={() => setSizeSelectorOpen(false)}
        sizes={sizes}
        onSelectSize={handleSelectSize}
      />
    </>
  );
}
