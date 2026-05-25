import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cartItems, totalAmount, totalItems, loading, updateCart, deleteCartItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleUpdateQty = async (cartItemId, productId, qty, size) => {
    await updateCart(cartItemId, productId, qty, size);
  };

  const handleRemoveItem = async (cartItemId) => {
    await deleteCartItem(cartItemId);
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const res = await clearCart();
      if (res.success) {
        toast.success('Cart cleared');
      }
    }
  };

  // Logistics parameters
  const shippingFee = totalAmount > 300 ? 0 : 15;
  const grandTotal = totalAmount + shippingFee;

  if (loading && cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-brand-muted border-t-brand-neon rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-brand-muted uppercase animate-pulse">
          Loading Shopping Cart...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10 text-left">
        <div>
          <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Your Selection</span>
          <h1 className="text-3xl font-black text-white uppercase mt-1">Shopping Cart</h1>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition duration-150 uppercase tracking-wider cursor-pointer"
          >
            <FiTrash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart Items Grid list */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cart_id}
                  item={item}
                  onUpdateQuantity={handleUpdateQty}
                  onRemove={handleRemoveItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Checkout Summary Sidebar */}
          <div className="lg:col-span-4 bg-brand-surface-card border border-white/5 rounded-3xl p-6 space-y-6 sticky top-28 text-left">
            
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-4 pt-2">
              
              {/* Items price row */}
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Items Subtotal ({totalItems})</span>
                <span className="text-white font-semibold">${totalAmount}</span>
              </div>
              
              {/* Shipping price row */}
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Shipping protection</span>
                {shippingFee === 0 ? (
                  <span className="text-brand-neon font-bold tracking-widest">FREE</span>
                ) : (
                  <span className="text-white font-semibold">${shippingFee}</span>
                )}
              </div>

              {/* Free shipping alert */}
              {totalAmount < 300 && (
                <p className="text-[10px] text-neutral-500 italic bg-white/5 p-2 rounded-xl border border-white/5">
                  Add <span className="text-brand-neon font-bold">${300 - totalAmount}</span> more for free secure shipping!
                </p>
              )}

              <div className="border-t border-white/5 my-2" />

              {/* Grand Total Row */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-white uppercase">Grand Total</span>
                <span className="text-xl font-black text-brand-neon shadow-sm shadow-brand-neon/10">${grandTotal}</span>
              </div>

            </div>

            {/* Checkout Actions CTA */}
            <div className="pt-4 space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-[1.02] active:scale-[0.98] transition duration-200 cursor-pointer shadow-lg shadow-brand-neon/10"
              >
                Proceed To Checkout <FiArrowRight className="w-4 h-4 font-black" />
              </button>
              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-full transition duration-200 border border-white/5"
              >
                Continue Shopping
              </Link>
            </div>

          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 border border-dashed border-white/10 rounded-3xl"
        >
          <div className="inline-flex p-4 bg-white/5 rounded-full text-neutral-500 mb-4 animate-pulse">
            <FiShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
            Your Cart is Empty
          </h3>
          <p className="text-xs text-neutral-500 mt-2 max-w-xs mx-auto leading-relaxed">
            You haven't added any authentic sneaker drops to your shopping cart yet. Let's find some heat!
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition duration-200 cursor-pointer"
          >
            Explore Sneakers <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

    </div>
  );
}
