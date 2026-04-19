import { Link } from 'react-router-dom'
import { IoLocationSharp, IoTimer, IoArrowForwardCircleSharp } from "react-icons/io5";

const CATEGORY_STYLES = {
  Nature:       'from-green-500/80 to-green-600/80 text-white',
  Heritage:     'from-amber-500/80 to-amber-600/80 text-white',
  Religious:    'from-purple-500/80 to-purple-600/80 text-white',
  Cultural:     'from-red-500/80 to-red-600/80 text-white',
  Recreational: 'from-teal-500/80 to-teal-600/80 text-white',
}

const MapPopupContent = ({ destination }) => {
  const catStyle = CATEGORY_STYLES[destination.category] || 'from-slate-500 to-slate-600 text-white';

  return (
    <div className="w-[220px] font-sans overflow-hidden rounded-xl bg-slate-600/90 backdrop-blur-md border border-white/10 p-0 shadow-2xl">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-28 w-full group overflow-hidden">
        {destination.images?.[0]?.url ? (
          <img
            src={destination.images[0].url}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/20">No Image</div>
        )}
        
        {/* Category Badge - Floating on Image */}
        <div className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-gradient-to-r ${catStyle} shadow-lg`}>
          {destination.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        <h3 className="text-white font-black text-sm uppercase tracking-tight leading-tight mb-1 truncate">
          {destination.name}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold">
            <IoLocationSharp className="text-blue-400 text-base" />
            <span>{destination.distanceFromRideegama} KM FROM RIDEEGAMA</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <IoTimer className="text-amber-400 text-lg" />
            <span>{destination.openingHours}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/destinations/${destination._id}`}
          className="group flex items-center justify-between w-full bg-white/10 hover:bg-white/20 border border-white/10 p-2 rounded-lg transition-all"
        >
          <span className="text-white text-[10px] font-black uppercase tracking-wider">Explore Details</span>
          <IoArrowForwardCircleSharp className="text-white text-lg transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default MapPopupContent