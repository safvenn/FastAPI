import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSliders } from 'react-icons/fi';

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <nav className={`max-w-7xl mx-auto ios-glass transition-all duration-500 shadow-2xl flex flex-col justify-center px-6 sm:px-8 rounded-[24px] ${mobileMenuOpen ? 'py-4' : 'h-20'}`}>
        <div className="w-full flex items-center justify-between h-16 shrink-0">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter text-white group-hover:text-brand-accent transition-colors duration-300">
            KICKS<span className="text-brand-accent">.</span>
          </span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
              isActive('/') ? 'text-brand-accent font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
              isActive('/products') ? 'text-brand-accent font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Shop
          </Link>
        </div>

        {/* Right Side: Navigation controls */}
        <div className="flex items-center gap-4">
          
          {/* Inline Search Bar Toggle */}
          <div className="relative">
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-brand-surface rounded-full border border-white/10 px-3 py-1.5"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sneakers..."
                    autoFocus
                    className="w-full bg-transparent text-sm text-white focus:outline-none border-none pl-1"
                  />
                  <button type="submit" className="text-neutral-400 hover:text-brand-accent p-0.5">
                    <FiSearch className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-neutral-500 hover:text-white ml-1 p-0.5"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Shopping Cart Icon with Badge */}
          <Link
            to="/cart"
            className="relative text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <FiShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-accent text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_8px_rgba(10,132,255,0.5)]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          <div className="relative">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <FiUser className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-52 bg-brand-surface rounded-xl border border-white/5 p-2 shadow-2xl z-50 backdrop-blur-xl"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <FiUser className="w-4 h-4 text-brand-accent" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <FiShoppingBag className="w-4 h-4 text-brand-accent" />
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-accent hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors font-bold"
                          >
                            <FiSliders className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="my-1 border-t border-white/5" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center justify-center px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full border border-white/10 hover:border-brand-accent hover:text-brand-accent hover:bg-brand-accent/5 transition-all duration-300"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full overflow-hidden mt-2"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold tracking-wide uppercase px-3 py-2 rounded-lg ${
                  isActive('/') ? 'text-brand-accent bg-white/5 font-extrabold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold tracking-wide uppercase px-3 py-2 rounded-lg ${
                  isActive('/products') ? 'text-brand-accent bg-white/5 font-extrabold' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Shop
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-bold tracking-widest uppercase py-3 rounded-full border border-white/10 text-white bg-white/5 active:bg-white/10 transition"
                >
                  Log In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </nav>
    </div>
  );
}
