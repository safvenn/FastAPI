import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiMinus, FiShoppingBag, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSkeleton';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Sync route param with state
  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setSelectedSize(''); // Reset selections
        setQuantity(1);
      } else {
        // Product not found
        setProduct(null);
      }
    }
  }, [id, products]);

  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-brand-muted border-t-brand-neon rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-brand-muted uppercase animate-pulse">
          Loading Sneaker Details...
        </p>
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-neutral-500 font-bold tracking-widest uppercase">Sneaker Not Found</p>
        <p className="text-xs text-neutral-600 mt-2">The sneaker drop you are looking for does not exist or has expired.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase rounded-full hover:bg-brand-neon transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

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

  // Related products from the same brand
  const relatedProducts = products
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  const handleQtyIncrease = () => setQuantity((prev) => prev + 1);
  const handleQtyDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a sneaker size.');
      return;
    }
    setAdding(true);
    const res = await addToCart(product.id, quantity, selectedSize);
    setAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-400 hover:text-white uppercase mb-8 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Go Back
      </button>

      {/* Main product card showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        
        {/* Left column: Shoe High-Res display */}
        <div className="lg:col-span-7 bg-brand-surface rounded-3xl border border-white/5 p-8 flex items-center justify-center relative aspect-square overflow-hidden">
          {/* Background brand letters */}
          <span className="absolute inset-0 flex items-center justify-center text-[10vw] font-black text-white/[0.02] tracking-widest select-none uppercase pointer-events-none">
            {product.brand}
          </span>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
            alt={product.title}
            loading="eager"
            decoding="async"
            className="max-h-[380px] object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transform -rotate-6 filter"
          />
        </div>

        {/* Right column: Purchase details form */}
        <div className="lg:col-span-5 text-left space-y-6">
          
          <div className="space-y-3">
            {/* Brand Category Tag */}
            <span className="inline-block text-[10px] font-black text-brand-neon bg-brand-neon/15 px-3 py-1 rounded-md uppercase tracking-widest">
              {product.brand} Drop
            </span>
            
            {/* Shoe Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {product.title}
            </h1>
            
            {/* Price */}
            <div className="text-2xl font-black text-white pt-1">
              ${product.price || '180'}
            </div>
          </div>

          <div className="border-t border-white/5 my-4" />

          {/* Sizing Grid Select Box */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Select Size (US Men's)
              </label>
              <a href="#" className="text-[10px] text-brand-neon hover:underline font-semibold uppercase tracking-widest">
                Size Guide
              </a>
            </div>

            {sizes.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-extrabold border rounded-xl transition duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-neon text-black border-brand-neon font-black shadow-[0_0_8px_rgba(57,255,20,0.2)]'
                          : 'bg-brand-surface-card text-white border-white/5 hover:border-white/25 hover:text-brand-neon'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-500">No sizes currently available.</p>
            )}
          </div>

          {/* Quantity modifiers */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              Quantity
            </label>
            <div className="inline-flex items-center bg-brand-surface border border-white/10 rounded-full px-3 py-1.5">
              <button
                onClick={handleQtyDecrease}
                className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/5 transition"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white px-5 min-w-[30px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleQtyIncrease}
                className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer hover:bg-white/5 transition"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedSize}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-xl cursor-pointer ${
                !selectedSize
                  ? 'bg-neutral-800 text-neutral-500 border border-white/5 cursor-not-allowed'
                  : 'bg-brand-neon text-black hover:scale-[1.02] active:scale-[0.98] shadow-brand-neon/10'
              }`}
            >
              <FiShoppingBag className="w-4 h-4 font-black" />
              {adding ? 'Processing...' : 'Add To Cart Drop'}
            </button>
          </div>

          {/* Authentic / Shipping badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-[10px] text-neutral-400">
            <div className="flex flex-col items-center text-center gap-1.5 p-2 bg-white/5 rounded-xl">
              <FiShield className="w-4 h-4 text-brand-neon" />
              <span className="font-bold text-white">LEGIT CHECKED</span>
              <span>100% Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 p-2 bg-white/5 rounded-xl">
              <FiTruck className="w-4 h-4 text-brand-neon" />
              <span className="font-bold text-white">DOUBLE BOXED</span>
              <span>Secure shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 p-2 bg-white/5 rounded-xl">
              <FiRotateCcw className="w-4 h-4 text-brand-neon" />
              <span className="font-bold text-white">RETURNS</span>
              <span>30 day guarantee</span>
            </div>
          </div>

          {/* Product description display */}
          <div className="pt-6 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Sneaker Description</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              {product.description || 'This premium sneaker drop combines dynamic athletic heritage with premium street-style aesthetics, showcasing handpicked materials and precision details built for high-performance visual impact.'}
            </p>
          </div>

        </div>

      </div>

      {/* Related Products list */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-white/5">
          <div className="text-left mb-8">
            <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Sneaker Matchers</span>
            <h3 className="text-2xl font-black text-white uppercase mt-1">Related Drops</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
