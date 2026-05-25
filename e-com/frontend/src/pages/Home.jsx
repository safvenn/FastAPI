import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSkeleton';
import heroSneakerImg from '../assets/hero_sneaker.png';

export default function Home() {
  const { products, loading } = useProducts();

  // Get first 4 products for featured section
  const featuredProducts = products.slice(0, 4);

  // Hardcoded premium sneaker promotion
  const heroSneaker = {
    id: 1,
    title: "Air Jordan 1 Retro High 'Travis Scott'",
    brand: "Jordan",
    description: "The Travis Scott x Air Jordan 1 Retro High features a backwards Swoosh and a hidden pouch in the collar.",
    price: 950,
    image_url: heroSneakerImg
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="pb-20">
      
      {/* 1. Hero Promo Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-brand-bg">
        
        {/* Animated Background Glowing Orbs */}
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
          {/* Subtle gradient light flare on card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/5 via-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Hero Left Content */}
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

            {/* Hero Right Sneaker Showcase Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ duration: 1, type: 'spring', stiffness: 50 }}
              className="relative flex items-center justify-center"
            >
              {/* Ambient Shadow glow below shoe */}
              <div className="absolute bottom-10 w-4/5 h-12 bg-black/60 rounded-full blur-2xl filter transform scale-x-110 rotate-5 pointer-events-none" />
              <img
                src={heroSneakerImg}
                alt="Jordan Premium Drop"
                loading="eager"
                decoding="async"
                className="max-h-[350px] sm:max-h-[480px] object-contain drop-shadow-[0_20px_50px_rgba(57,255,20,0.15)] filter"
              />
            </motion.div>

          </div>
        </div>

      </section>

      {/* 2. Trending Brands Section */}
      <section className="py-12 bg-brand-surface border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-6">
            Trending Footwear Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {['NIKE', 'JORDAN', 'ADIDAS', 'YEEZY', 'PUMA'].map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${brand}`}
                className="text-lg md:text-2xl font-black tracking-widest text-neutral-400 hover:text-brand-neon transition duration-200"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2 text-left">
            <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Featured Drops</span>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Featured Sneakers</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest text-brand-neon hover:underline uppercase"
          >
            View All Sneakers <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <ProductSkeleton key={n} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
            No premium drops currently available. Check back soon.
          </div>
        )}

      </section>

      {/* 4. Brand Value / trust banners */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex items-start gap-5 text-left p-6 ios-glass rounded-[24px] hover:scale-[1.03] hover:border-brand-neon/20 transition-all duration-300 shadow-lg">
            <div className="p-3 bg-brand-neon/10 rounded-xl text-brand-neon">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Authentic</h4>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Every pair is carefully inspected and verified by our sneaker specialists before packaging. Guaranteed legit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 text-left p-6 ios-glass rounded-[24px] hover:scale-[1.03] hover:border-brand-neon/20 transition-all duration-300 shadow-lg">
            <div className="p-3 bg-brand-neon/10 rounded-xl text-brand-neon">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Market Pricing</h4>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                We track the GOAT & StockX indices to deliver the most competitive live market pricing available online.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 text-left p-6 ios-glass rounded-[24px] hover:scale-[1.03] hover:border-brand-neon/20 transition-all duration-300 shadow-lg">
            <div className="p-3 bg-brand-neon/10 rounded-xl text-brand-neon">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Premium Logistics</h4>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Shipped in secure double-boxed protection with signature confirmation. Fast global express delivery.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Custom CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden ios-glass ios-curve-lg p-8 sm:p-16 flex flex-col items-center text-center gap-6 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-neon/5 via-transparent to-transparent pointer-events-none" />
          <span className="text-xs font-black tracking-widest text-brand-neon uppercase bg-brand-neon/10 px-3 py-1 rounded">
            MEMBERSHIP ACCESS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-[0.95] max-w-lg">
            JOIN THE PREMIUM MOVEMENT.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed">
            Create an account to gain early access to upcoming drops, purchase status tracking, and member-only sneaker collections.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-brand-neon transition duration-200 cursor-pointer"
          >
            Create Free Account <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
