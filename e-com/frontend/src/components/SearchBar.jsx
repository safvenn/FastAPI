import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search sneakers by title...' }) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiSearch className="h-5 h-5 text-neutral-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-10 py-3 bg-brand-surface border border-white/10 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white cursor-pointer"
        >
          <FiX className="h-4 h-4" />
        </button>
      )}
    </div>
  );
}
