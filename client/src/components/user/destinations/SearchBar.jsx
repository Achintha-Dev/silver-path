import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
      <input
        id='text'
        type="text"
        placeholder="Search destinations by name or description..."
        className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-11 pr-10 py-3.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/40 focus:bg-white/15 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
        >
          <FaTimes className="text-sm" />
        </button>
      )}
    </div>
  );
}

export default SearchBar