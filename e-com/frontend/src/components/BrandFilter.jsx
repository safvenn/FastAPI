import { motion } from 'framer-motion';

export default function BrandFilter({ brands = [], selectedBrand, onSelectBrand }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 flex items-center gap-2.5">
      {brands.map((brand) => {
        const isSelected = selectedBrand === brand;

        return (
          <button
            key={brand}
            onClick={() => onSelectBrand(brand)}
            className={`relative px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 flex-shrink-0 cursor-pointer border ${
              isSelected
                ? 'bg-brand-neon text-black border-brand-neon shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                : 'bg-brand-surface text-neutral-400 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}
