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
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface-card border border-white/5 p-4 rounded-2xl"
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
          <span className="text-[10px] font-black text-brand-neon uppercase tracking-widest bg-brand-neon/10 px-2 py-0.5 rounded">
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
        <div className="flex items-center bg-brand-surface border border-white/10 rounded-full px-2 py-1">
          <button
            onClick={handleDecrease}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/5 transition"
          >
            <FiMinus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-white px-3 min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/5 transition"
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
            className="text-neutral-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Remove item"
          >
            <FiTrash2 className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
