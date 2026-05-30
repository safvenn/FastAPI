export default function BrandFilter({ brands = [], selectedBrand, onSelectBrand }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 flex items-center gap-2.5">
      {brands.map((brand) => {
        const isSelected = selectedBrand === brand;

        return (
          <button
            key={brand}
            onClick={() => onSelectBrand(brand)}
            className={`min-h-[44px] px-5 py-2.5 text-xs font-extrabold tracking-widest uppercase rounded-full border transition-all duration-200 flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent ${
              isSelected
                ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_20px_rgba(10,132,255,0.25)]'
                : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/10'
            }`}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}
