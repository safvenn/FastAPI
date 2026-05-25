import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function SizeSelector({ isOpen, onClose, sizes = [], onSelectSize }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-brand-surface border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition duration-150 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <h3 className="text-lg font-bold text-white mb-2">Select Sneaker Size</h3>
            <p className="text-xs text-brand-muted mb-6">
              All sizes listed are in Standard US Men's sizing.
            </p>

            {/* Size Grid */}
            {sizes.length > 0 ? (
              <div className="grid grid-cols-4 gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onSelectSize(size)}
                    className="aspect-square flex items-center justify-center text-sm font-extrabold text-white bg-brand-surface-card border border-white/5 rounded-xl hover:border-brand-neon hover:text-brand-neon transition-all duration-200 cursor-pointer hover:bg-brand-neon/5 active:scale-95"
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-500 text-xs">
                No sizes currently available for this sneaker.
              </div>
            )}

            {/* Help Links */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <a href="#" className="text-[10px] font-bold text-brand-neon hover:underline tracking-widest uppercase">
                View Size Guide
              </a>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
