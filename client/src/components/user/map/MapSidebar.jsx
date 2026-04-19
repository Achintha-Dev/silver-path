import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaClock, FaChevronRight } from 'react-icons/fa'

const CATEGORY_COLORS = {
  Nature:       'bg-green-500/20 text-green-400',
  Heritage:     'bg-amber-500/20 text-amber-400',
  Religious:    'bg-purple-500/20 text-purple-400',
  Cultural:     'bg-red-500/20 text-red-400',
  Recreational: 'bg-teal-500/20 text-teal-400',
}

const MapSidebar = ({ destinations, loading, activeId, onHover }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <h2 className="text-white font-black uppercase tracking-wider text-sm">
          Destinations
        </h2>
        <p className="text-white/40 text-xs mt-1">
          {destinations.length} places within 25 km
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {destinations.map((dest) => (
          <div
            key={dest._id}
            onMouseEnter={() => onHover(dest._id)}
            onMouseLeave={() => onHover(null)}
            className={`border-b border-white/5 transition-all cursor-pointer ${
              activeId === dest._id ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
          >
            <Link
              to={`/destinations/${dest._id}`}
              className="flex items-center gap-3 p-4"
            >
              {/* Thumbnail */}
              <img
                src={dest.images?.[0]?.url || 'https://placehold.co/48x48'}
                alt={dest.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-black uppercase tracking-tight truncate">
                  {dest.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${CATEGORY_COLORS[dest.category]}`}>
                    {dest.category}
                  </span>
                  <span className="text-white/40 text-[10px] flex items-center gap-1">
                    <FaMapMarkerAlt className="text-green-400" style={{ fontSize: '8px' }} />
                    {dest.distanceFromRideegama} km
                  </span>
                </div>
              </div>

              <FaChevronRight className="text-white/20 text-xs flex-shrink-0" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapSidebar