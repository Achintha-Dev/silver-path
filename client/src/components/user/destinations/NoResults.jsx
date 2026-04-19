import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const NoResults = ({ search, onClear }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <FaSearch className="text-white/20 text-3xl" />
      </div>
      <h3 className="text-white font-black text-xl uppercase tracking-tight mb-2">
        No destinations found
      </h3>
      {search ? (
        <p className="text-white/50 text-sm mb-6 max-w-sm">
          No results for <span className="text-white/80 font-bold">"{search}"</span>.
          Try a different search term or clear your filters.
        </p>
      ) : (
        <p className="text-white/50 text-sm mb-6 max-w-sm">
          No destinations match your current filters.
          Try adjusting the category or distance.
        </p>
      )}
      <button
        onClick={onClear}
        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all border border-white/10"
      >
        Clear All Filters
      </button>
    </div>
  )
}

export default NoResults