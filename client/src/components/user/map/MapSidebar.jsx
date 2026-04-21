import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaClock, FaChevronRight, FaStar, FaSearch } from 'react-icons/fa'

const CATEGORY_COLORS = {
  Nature:       'bg-green-500/10 text-green-400 border-green-200/20',
  Heritage:     'bg-amber-200/10 text-amber-400 border-amber-200/20',
  Religious:    'bg-purple-500/10 text-purple-400 border-purple-200/20',
  Cultural:     'bg-red-500/10 text-red-400 border-red-200/20',
  Recreational: 'bg-teal-500/10 text-teal-400 border-teal-200/20',
}

// Loading skeleton component
const DestinationSkeleton = () => (
  <div className="border-b border-white/20 p-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 bg-white/10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    </div>
  </div>
)

const MapSidebar = ({ destinations, loading, activeId, onHover, searchQuery }) => {
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {/* Header Skeleton */}
        <div className="p-4 border-b border-white/20 flex-shrink-0">
          <div className="h-6 bg-white/10 rounded w-32 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-48 mt-2 animate-pulse" />
        </div>

        {/* List Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <DestinationSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-white/20 flex-shrink-0 bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-black uppercase tracking-wider text-lg">
            Destinations
          </h2>
          {searchQuery && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <FaSearch className="text-xs" />
              <span>"{searchQuery}"</span>
            </div>
          )}
        </div>
        <p className="text-white/70 text-sm font-medium">
          {destinations.length} place{destinations.length !== 1 ? 's' : ''} within 25 km
        </p>
      </div>

      {/* Enhanced List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-white/40 text-2xl" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No destinations found</h3>
            <p className="text-white/60 text-sm">
              {searchQuery
                ? `Try adjusting your search for "${searchQuery}"`
                : 'No destinations match the current filters'
              }
            </p>
          </div>
        ) : (
          destinations.map((dest) => (
            <div
              key={dest._id}
              onMouseEnter={() => onHover(dest._id)}
              onMouseLeave={() => onHover(null)}
              className={`group border-b border-white/20 transition-all duration-200 cursor-pointer ${
                activeId === dest._id
                  ? 'bg-white/10 border-white/30 shadow-lg shadow-white/10'
                  : 'hover:bg-white/5 hover:border-white/30'
              }`}
            >
              <Link
                to={`/destinations/${dest._id}`}
                className="flex items-center gap-4 p-4 group-hover:scale-[0.99] transition-transform duration-200"
              >
                {/* Enhanced Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={dest.images?.[0]?.url || 'https://placehold.co/56x56/e2e8f0/64748b?text=No+Image'}
                    alt={dest.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/20 group-hover:border-white/30 transition-all duration-200 shadow-md"
                  />
                  {activeId === dest._id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-black animate-pulse" />
                  )}
                </div>

                {/* Enhanced Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm uppercase tracking-tight leading-tight mb-2 truncate group-hover:text-white transition-colors">
                    {dest.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${CATEGORY_COLORS[dest.category]} shadow-sm`}>
                      {dest.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-white/60 text-xs">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-green-400 text-xs" />
                      <span className="font-medium">{dest.distanceFromRideegama} km</span>
                    </div>
                    {dest.rating && (
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="font-medium">{dest.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Chevron */}
                <div className={`flex-shrink-0 transition-all duration-200 ${
                  activeId === dest._id ? 'text-white translate-x-1' : 'text-white/40 group-hover:text-white/60 group-hover:translate-x-0.5'
                }`}>
                  <FaChevronRight className="text-sm" />
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {destinations.length > 0 && (
        <div className="p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Total destinations: {destinations.length}</span>
            <span>Within 25km radius</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapSidebar