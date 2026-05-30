import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function SizeSelector({ isOpen, onClose, sizes = [], onSelectSize, selectedSize }) {
  // Escape key closes the modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Select Sneaker Size"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md ios-glass-heavy rounded-[28px] p-6 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close size selector"
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => onSelectSize(size)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectSize(size);
                        }
                      }}
                      aria-pressed={isSelected}
                      aria-label={`Size ${size}${isSelected ? ', selected' : ''}`}
                      className={`
                        aspect-square flex items-center justify-center
                        min-w-[44px] min-h-[44px]
                        text-sm font-extrabold rounded-xl
                        border transition-all duration-200 cursor-pointer active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-brand-accent
                        ${isSelected
                          ? 'bg-brand-accent text-black border-brand-accent'
                          : 'bg-white/5 text-white border-white/10 hover:border-brand-accent/50 hover:bg-brand-accent/5'
                        }
                      `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-500 text-xs">
                No sizes currently available for this sneaker.
              </div>
            )}

            {/* Help Links */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <a
                href="#"
                className="text-[10px] font-bold text-brand-accent hover:underline tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-brand-accent rounded"
              >
                View Size Guide
              </a>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
