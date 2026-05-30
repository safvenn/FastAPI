import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleIncrease = () => {
    onUpdateQuantity(item.cart_id, item.product_id, item.quantity + 1, item.sizes);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cart_id, item.product_id, item.quantity - 1, item.sizes);
    } else {
      onRemove(item.cart_id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="ios-glass rounded-[20px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Left side: Sneaker info & Image */}
      <div className="flex items-center gap-4">
        {/* Sneaker Image */}
        <div className="w-20 h-20 bg-brand-surface rounded-xl flex items-center justify-center p-2 border border-white/5 flex-shrink-0">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
            alt={item.title}
            className="max-w-full max-h-full object-contain -rotate-6"
          />
        </div>

        {/* Sneaker metadata */}
        <div>
          <span className="text-brand-accent text-xs font-black uppercase tracking-widest bg-brand-accent/10 px-2 py-0.5 rounded">
            {item.brand}
          </span>
          <h4 className="text-sm font-semibold text-white mt-1.5 line-clamp-1">{item.title}</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Size: <span className="text-white font-semibold">US {item.sizes}</span>
          </p>
        </div>
      </div>

      {/* Right side: Quantity control & Price & Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none border-white/5 pt-3 sm:pt-0">

        {/* Quantity Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrease}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white bg-white/5 border border-white/10 hover:border-brand-accent/50 rounded-full cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label="Decrease quantity"
          >
            <FiMinus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-white px-3 min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white bg-white/5 border border-white/10 hover:border-brand-accent/50 rounded-full cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label="Increase quantity"
          >
            <FiPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Price and Action Row */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-neutral-500 block">Subtotal</span>
            <span className="text-sm font-extrabold text-white">${item.item_total || '180'}</span>
          </div>

          <button
            onClick={() => onRemove(item.cart_id)}
            className="text-neutral-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent"
            title="Remove item"
            aria-label="Remove item"
          >
            <FiTrash2 className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
