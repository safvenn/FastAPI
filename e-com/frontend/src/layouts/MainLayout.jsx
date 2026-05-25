import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-neutral-200 selection:bg-brand-neon selection:text-black">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ willChange: 'transform, opacity' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
