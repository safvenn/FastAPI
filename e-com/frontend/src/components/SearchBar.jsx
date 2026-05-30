import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search sneakers by title...' }) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-neutral-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white cursor-pointer"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
