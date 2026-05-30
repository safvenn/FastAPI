import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { pageTransition } from '../lib/motion';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-neutral-200 selection:bg-brand-accent selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
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
