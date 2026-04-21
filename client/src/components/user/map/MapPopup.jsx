import { Link } from 'react-router-dom'
import { IoLocationSharp, IoTimer, IoArrowForwardCircleSharp, IoStar, IoHeart, IoLocation } from "react-icons/io5";

const CATEGORY_STYLES = {
  Nature:       'bg-green-500/10 text-green-400 border-green-200/20',
  Heritage:     'bg-amber-200/10 text-amber-400 border-amber-200/20',
  Religious:    'bg-purple-500/10 text-purple-400 border-purple-200/20',
  Cultural:     'bg-red-500/10 text-red-400 border-red-200/20',
  Recreational: 'bg-teal-500/10 text-teal-400 border-teal-200/20',
}

const MapPopupContent = ({ destination }) => {
  const catStyle = CATEGORY_STYLES[destination.category] || 'bg-white/10 text-white border-white/20';

  return (
    <div className="w-[240px] font-sans overflow-hidden rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 p-0 shadow-xl hover:shadow-white/10 transition-all duration-300">
      
      {/* Enhanced Image Container */}
      <div className="relative h-32 w-full group overflow-hidden rounded-t-2xl">
        {destination.images?.[0]?.url ? (
          <img
            src={destination.images[0].url}
            alt={destination.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <div className="text-white/40 text-2xl font-bold"><IoLocation /></div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Enhanced Category Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border backdrop-blur-sm ${catStyle}`}>
          {destination.category}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
          <IoLocationSharp className="text-green-400 text-xs" />
          <span className="text-white text-xs font-bold">{destination.distanceFromRideegama} KM</span>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-white font-black text-base uppercase tracking-tight leading-tight flex-1 pr-2">
            {destination.name}
          </h3>
          {destination.rating && (
            <div className="flex items-center gap-1 bg-yellow-500/20 rounded-full px-2 py-1 border border-yellow-400/30">
              <IoStar className="text-yellow-400 text-xs" />
              <span className="text-yellow-300 text-xs font-bold">{destination.rating}</span>
            </div>
          )}
        </div>

        {/* Opening Hours */}
        <div className="flex items-center gap-2 mb-4 text-white/70">
          <IoTimer className="text-amber-400 text-base flex-shrink-0" />
          <span className="text-sm font-medium">{destination.openingHours || 'Hours not specified'}</span>
        </div>

        {/* Description Preview */}
        {destination.description && (
          <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
            {destination.description}
          </p>
        )}

        {/* Enhanced Action Button */}
        <Link
          to={`/destinations/${destination._id}`}
          className="group flex items-center justify-between w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 p-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02]"
        >
          <span className="text-white text-sm font-bold uppercase tracking-wider">Explore Details</span>
          <IoArrowForwardCircleSharp className="text-white text-lg transition-transform group-hover:translate-x-1 group-hover:scale-110" />
        </Link>
      </div>
    </div>
  )
}

export default MapPopupContent