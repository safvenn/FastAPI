import { FiTwitter, FiInstagram, FiFacebook, FiYoutube, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="glass-nav border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Links & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo + Mission */}
          <div className="space-y-4">
            <span className="text-xl font-black tracking-tighter text-white">
              KICKS<span className="text-brand-accent">.</span>
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              Defining the culture of premium footwear since 2026. Handpicked authentic sneakers from Nike, GOAT, and exclusive collaborations.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">
                <FiFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-brand-accent hover:bg-brand-accent/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">
                <FiYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop category links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="/products" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">All Sneakers</a></li>
              <li><a href="/products?brand=Nike" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Nike Air Force</a></li>
              <li><a href="/products?brand=Jordan" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Air Jordan Retro</a></li>
              <li><a href="/products?brand=Adidas" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Adidas Yeezy</a></li>
            </ul>
          </div>

          {/* Legal / Info links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Customer Support</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Return & Exchange</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Authenticity Guarantee</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter / Stay in loop */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">Stay in the Loop</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Subscribe to get release alerts, member discounts, and exclusive collections.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex rounded-full p-1">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-accent text-black p-2 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer ml-1"
              >
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-neutral-500">
            &copy; {new Date().getFullYear()} KICKS Inc. All rights reserved. Registered under GOAT guidelines.
          </p>
          <div className="flex gap-4 text-[10px] text-neutral-500">
            <a href="#" className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
