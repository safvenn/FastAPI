import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import BrandFilter from '../components/BrandFilter';
import { ProductSkeleton } from '../components/LoadingSkeleton';

export default function Products() {
  const { products, loading, error, brands } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected brand state
  const [selectedBrand, setSelectedBrand] = useState('All');
  // Live search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with URL params
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const searchParam = searchParams.get('search');

    if (brandParam) {
      setSelectedBrand(brandParam);
    } else {
      setSelectedBrand('All');
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Handle brand selection
  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    
    // Update URL param
    const newParams = new URLSearchParams(searchParams);
    if (brand === 'All') {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brand);
    }
    setSearchParams(newParams);
  };

  // Handle live search update
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    
    const newParams = new URLSearchParams(searchParams);
    if (!query) {
      newParams.delete('search');
    } else {
      newParams.set('search', query);
    }
    setSearchParams(newParams);
  };

  // Perform client-side filter
  const filteredProducts = products.filter((product) => {
    const matchesBrand =
      selectedBrand === 'All' ||
      (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());

    const matchesSearch =
      !searchQuery ||
      (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBrand && matchesSearch;
  });

  // Marketplace-style result label
  const resultLabel =
    selectedBrand && selectedBrand !== 'All'
      ? `${filteredProducts.length} ${selectedBrand}`
      : `${filteredProducts.length} Sneakers`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
        <div>
          <span className="text-xs font-black text-brand-accent tracking-widest uppercase">Sneaker Catalogue</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1">
            Shop Premium Sneakers
          </h1>
          {/* Marketplace-style result count */}
          <p className="text-xs text-neutral-500 mt-2 tracking-wide">
            {resultLabel}
          </p>
        </div>

        {/* Live Search Input — glass filter bar */}
        <div className="ios-glass rounded-[20px] p-1.5">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>

      {/* Horizontal Brand Pills Filter — glass container */}
      <div className="ios-glass rounded-[20px] px-4 mb-8 border-b border-white/5 pb-4">
        <BrandFilter
          brands={brands}
          selectedBrand={selectedBrand}
          onSelectBrand={handleSelectBrand}
        />
      </div>

      {/* Main Grid display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-400 text-sm font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-white text-black text-xs font-bold uppercase rounded-full hover:bg-brand-accent transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty search/filter state */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border border-dashed border-white/10 rounded-2xl"
        >
          <p className="text-neutral-500 text-sm font-semibold uppercase tracking-widest">
            No Sneakers Found
          </p>
          <p className="text-xs text-neutral-600 mt-2 max-w-xs mx-auto leading-relaxed">
            Try adjusting your search criteria or selected filters to find authentic footwear.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('All');
              setSearchQuery('');
              setSearchParams({});
            }}
            className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase rounded-full hover:bg-white/10 transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

    </div>
  );
}
