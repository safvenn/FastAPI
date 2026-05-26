import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp, FiCheckCircle, FiChevronLeft, FiChevronRight, FiZap, FiStar } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSkeleton';
import heroSneakerImg from '../assets/hero_sneaker.png';

const SLIDE_DURATION = 4000; // 4 seconds per slide
const BRAND_LIST = ['NIKE', 'JORDAN', 'ADIDAS', 'YEEZY', 'PUMA', 'NEW BALANCE', 'REEBOK', 'CONVERSE'];

export default function Home() {
  const { products, loading } = useProducts();

  // ─── Auto-sliding carousel state ──────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Featured products for auto-slider (up to 8)
  const carouselProducts = useMemo(() => products.slice(0, 8), [products]);

  // How many cards visible per "page" (responsive)
  const cardsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(carouselProducts.length / cardsPerPage));

  const goToSlide = useCallback((idx) => {
    setCurrentSlide(idx % totalPages);
  }, [totalPages]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || carouselProducts.length === 0) return;
    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [isPaused, nextSlide, carouselProducts.length, currentSlide]);

  // ─── Brand category tabs ─────────────────────────────────────
  const [activeBrand, setActiveBrand] = useState('All');

  // Extract unique brands from actual product data
  const availableBrands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand).filter(Boolean));
    return ['All', ...Array.from(brandSet)];
  }, [products]);

  // Filtered products by selected brand
  const filteredProducts = useMemo(() => {
    if (activeBrand === 'All') return products;
    return products.filter((p) => p.brand?.toLowerCase() === activeBrand.toLowerCase());
  }, [products, activeBrand]);

  // ─── Animation variants ──────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="pb-20">
      
      {/* ══════════════════════════════════════════════════════════
          1. HERO SECTION — Premium sneaker showcase
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-brand-bg">
        
        {/* Animated ambient glowing orbs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-[350px] h-[350px] bg-brand-neon/10 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -25, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brand-neon/5 rounded-full blur-[130px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto relative z-10 ios-glass ios-curve-lg p-8 sm:p-16 md:p-20 shadow-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/5 via-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Hero Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-6 text-left"
            >
              <span className="inline-block text-xs font-black tracking-widest text-brand-neon bg-brand-neon/15 px-3.5 py-1.5 rounded-full uppercase">
                Limited Edition Drop
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[0.95]">
                STEP INTO <br />
                <span className="text-gradient">THE FUTURE.</span>
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base max-w-md leading-relaxed">
                Explore our curated selection of authentic streetwear, high-end collabs, and luxury sneaker culture. Validated by collectors, worn by legends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-neon text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-105 hover:neon-glow transition duration-300 cursor-pointer"
                >
                  Shop Collection <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?brand=Jordan"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-white/10 transition duration-300"
                >
                  Explore Jordans
                </Link>
              </div>
            </motion.div>

            {/* Hero Right — Floating sneaker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: 'spring', stiffness: 50 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute bottom-10 w-4/5 h-12 bg-black/60 rounded-full blur-2xl filter transform scale-x-110 pointer-events-none" />
              <img
                src={heroSneakerImg}
                alt="Jordan Premium Drop"
                loading="eager"
                decoding="async"
                className="max-h-[350px] sm:max-h-[480px] object-contain drop-shadow-[0_20px_50px_rgba(57,255,20,0.15)] animate-float"
              />
            </motion.div>

          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          2. BRAND MARQUEE — Infinite scrolling brand banner
          ══════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-brand-surface border-y border-white/5 overflow-hidden">
        <div className="max-w-full mx-auto">
          <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-5 text-center">
            Trending Footwear Brands
          </p>
          <div className="relative overflow-hidden">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-brand-surface to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-surface to-transparent z-10 pointer-events-none" />
            
            {/* Marquee track — duplicated for seamless loop */}
            <div className="marquee-track">
              {[...BRAND_LIST, ...BRAND_LIST].map((brand, i) => (
                <Link
                  key={`${brand}-${i}`}
                  to={`/products?brand=${brand}`}
                  className="flex-shrink-0 mx-8 md:mx-14 text-xl md:text-3xl font-black tracking-[0.2em] text-neutral-500 hover:text-brand-neon transition-colors duration-300 uppercase select-none"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. AUTO-SLIDING PRODUCT CAROUSEL — Featured Drops
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <FiZap className="w-4 h-4 text-brand-neon" />
              <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Hot Drops</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Trending Now</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Manual carousel navigation */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-neon hover:text-black hover:border-brand-neon transition-all duration-200 cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-neon hover:text-black hover:border-brand-neon transition-all duration-200 cursor-pointer"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-brand-neon hover:underline uppercase ml-2"
            >
              View All <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel viewport */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductSkeleton key={n} />
            ))}
          </div>
        ) : carouselProducts.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {carouselProducts
                  .slice(currentSlide * cardsPerPage, currentSlide * cardsPerPage + cardsPerPage)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </motion.div>
            </AnimatePresence>

            {/* Carousel indicators + progress bar */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className="relative group cursor-pointer"
                >
                  <div
                    className={`w-8 h-1.5 rounded-full transition-all duration-300 overflow-hidden ${
                      idx === currentSlide ? 'bg-brand-neon/30' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {idx === currentSlide && !isPaused && (
                      <div
                        key={`progress-${currentSlide}`}
                        className="h-full bg-brand-neon rounded-full progress-bar-fill"
                        style={{ '--slide-duration': `${SLIDE_DURATION}ms` }}
                      />
                    )}
                    {idx === currentSlide && isPaused && (
                      <div className="h-full bg-brand-neon rounded-full w-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
            No premium drops currently available. Check back soon.
          </div>
        )}

      </section>

      {/* ══════════════════════════════════════════════════════════
          4. CATEGORISED PRODUCTS — Browse by Brand
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <FiStar className="w-4 h-4 text-brand-neon" />
                <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Curated Collection</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Shop by Brand</h2>
            </div>
          </div>

          {/* Brand filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {availableBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={`px-5 py-2.5 text-xs font-extrabold tracking-widest uppercase rounded-full border transition-all duration-200 cursor-pointer ${
                  activeBrand === brand
                    ? 'bg-brand-neon text-black border-brand-neon shadow-[0_0_20px_rgba(57,255,20,0.2)]'
                    : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/10'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Filtered product grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <ProductSkeleton key={n} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              key={activeBrand}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.slice(0, 8).map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
              No sneakers found for "{activeBrand}". Try another brand.
            </div>
          )}

          {/* View all link for selected brand */}
          {filteredProducts.length > 8 && (
            <div className="text-center mt-10">
              <Link
                to={activeBrand === 'All' ? '/products' : `/products?brand=${activeBrand}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 hover:border-brand-neon/30 text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-white/10 transition duration-200"
              >
                View All {activeBrand !== 'All' ? activeBrand : ''} Sneakers <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. TRUST BADGES — Brand values
          ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Why KICKS</span>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase mt-2">The Premium Standard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="flex items-start gap-5 text-left p-6 ios-glass rounded-[24px] hover:scale-[1.03] hover:border-brand-neon/20 transition-all duration-300 shadow-lg"
            >
              <div className="p-3 bg-brand-neon/10 rounded-xl text-brand-neon">
                <FiShield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Authentic</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Every pair is carefully inspected and verified by our sneaker specialists before packaging. Guaranteed legit.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-5 text-left p-6 ios-glass rounded-[24px] hover:scale-[1.03] hover:border-brand-neon/20 transition-all duration-300 shadow-lg"
            >
              <div className="p-3 bg-brand-neon/10 rounded-xl text-brand-neon">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Market Pricing</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  We track the GOAT & StockX indices to deliver the most competitive live market pricing available online.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-5 text-left p-6 ios-glass rounded-[24px] hover:scale-[1.03] hover:border-brand-neon/20 transition-all duration-300 shadow-lg"
            >
              <div className="p-3 bg-brand-neon/10 rounded-xl text-brand-neon">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Premium Logistics</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Shipped in secure double-boxed protection with signature confirmation. Fast global express delivery.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. CTA BANNER — Membership
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden ios-glass ios-curve-lg p-8 sm:p-16 flex flex-col items-center text-center gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/5 via-transparent to-transparent pointer-events-none" />
          {/* Animated accent orb */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -right-20 w-60 h-60 bg-brand-neon/10 rounded-full blur-[80px] pointer-events-none"
          />
          <span className="text-xs font-black tracking-widest text-brand-neon uppercase bg-brand-neon/10 px-3 py-1 rounded relative z-10">
            MEMBERSHIP ACCESS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-[0.95] max-w-lg relative z-10">
            JOIN THE PREMIUM MOVEMENT.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed relative z-10">
            Create an account to gain early access to upcoming drops, purchase status tracking, and member-only sneaker collections.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-brand-neon transition duration-200 cursor-pointer relative z-10"
          >
            Create Free Account <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
