import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiActivity } from 'react-icons/fi';
import { heroReveal } from '../lib/motion';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';
import MarketStatPanel from './MarketStatPanel';
import PriceTicker from './PriceTicker';
import heroSneakerImg from '../assets/hero_sneaker.png';

export default function Hero({ products = [] }) {
  const prefersReduced = useReducedMotionPref();
  const featuredProduct = products[0] || null;
  const changePct = 3.2; // static display value for the hero

  const textVariants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : heroReveal;

  const imageVariants = prefersReduced
    ? { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } }
    : { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 1, type: 'spring', stiffness: 60, damping: 20 } } };

  return (
    <section className="relative overflow-hidden bg-brand-bg">
      {/* Ambient glow orbs */}
      {!prefersReduced && (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[140px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-accent/8 rounded-full blur-[120px] pointer-events-none"
          />
        </>
      )}

      {/* Main hero panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="ios-glass ios-curve-lg p-8 sm:p-14 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/5 via-transparent to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Left: Text content */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Live market eyebrow */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-black tracking-widest text-brand-accent bg-brand-accent/15 px-3.5 py-1.5 rounded-full uppercase">
                  <FiActivity className="w-3 h-3" />
                  Live Market
                </span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  · Premium Drops
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-[0.95]">
                STEP INTO <br />
                <span className="text-gradient-blue">THE FUTURE.</span>
              </h1>

              {/* Subheading */}
              <p className="text-neutral-400 text-sm sm:text-base max-w-md leading-relaxed">
                Curated authentic streetwear and luxury sneaker culture. Market-priced, collector-verified, delivered fast.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-105 hover:shadow-[0_0_24px_rgba(10,132,255,0.4)] transition duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black"
                >
                  Shop Collection <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?brand=Jordan"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 hover:border-brand-accent/40 text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-white/10 transition duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  Explore Jordans
                </Link>
              </div>
            </motion.div>

            {/* Right: Sneaker + MarketStatPanel */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative flex items-center justify-center"
            >
              {/* Radial accent spotlight behind sneaker */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.12)_0%,transparent_70%)] pointer-events-none" />

              {/* Sneaker image */}
              <img
                src={heroSneakerImg}
                alt="Featured premium sneaker drop"
                loading="eager"
                decoding="async"
                className={`max-h-[320px] sm:max-h-[420px] object-contain drop-shadow-[0_20px_50px_rgba(10,132,255,0.2)] relative z-10 ${!prefersReduced ? 'animate-float' : ''}`}
              />

              {/* MarketStatPanel — overlaid bottom-left of the sneaker */}
              {featuredProduct && (
                <div className="absolute bottom-0 left-0 z-20">
                  <MarketStatPanel product={featuredProduct} changePct={changePct} />
                </div>
              )}
            </motion.div>

          </div>
        </div>

        {/* Price Ticker — below the hero panel */}
        <div className="mt-4 ios-glass rounded-[16px] overflow-hidden">
          <PriceTicker products={products} />
        </div>
      </div>
    </section>
  );
}
