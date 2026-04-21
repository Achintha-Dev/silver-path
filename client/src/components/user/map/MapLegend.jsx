import { useState } from 'react'
import { ImLeaf } from 'react-icons/im'
import { FaVihara, FaUsers, FaHiking, FaPray, FaLandmark, FaCircle, FaMapMarkerAlt, FaMinus, FaPlus } from "react-icons/fa";

const LEGEND_ITEMS = [
  { label: 'Nature',       color: '#10b981', icon: <ImLeaf className='text-green-400 shadow-sm hover:scale-110 transition-transform' /> },
  { label: 'Heritage',     color: '#f59e0b', icon: <FaLandmark className='text-yellow-400 shadow-sm hover:scale-110 transition-transform' /> },
  { label: 'Religious',    color: '#8b5cf6', icon: <FaVihara className='text-purple-500 shadow-sm hover:scale-110 transition-transform' /> },
  { label: 'Cultural',     color: '#ef4444', icon: <FaUsers className='text-red-500 shadow-sm hover:scale-110 transition-transform' /> },
  { label: 'Recreational', color: '#06b6d4', icon: <FaHiking className='text-teal-500 shadow-sm hover:scale-110 transition-transform' /> },
]

const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // Desktop: expanded by default, Mobile: minimized
    }
    return true; // Default to expanded for SSR
  });

  return (
    <div className={`bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-4 shadow-xl hover:shadow-white/10 transition-all duration-300 ${isExpanded ? '' : 'pb-3'}`}>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <p className="text-white text-sm uppercase tracking-wider font-bold">
            Map Legend
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/50 hover:text-white transition-colors bg-white/10 rounded-lg p-1 text-xs font-bold tracking-wider ml-2"
          title={isExpanded ? 'Minimize legend' : 'Maximize legend'}
        >
          {isExpanded ? <FaMinus /> : <FaPlus />}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Category Items */}
          <div className="space-y-3">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-3 group">
                <div
                  className="relative flex-shrink-0 p-1.5 rounded-lg bg-white/10 border border-white/20 group-hover:border-white/30 transition-all duration-200"
                >
                  <div className="w-4 h-4 shadow-sm"/>
                    <div className="absolute inset-0 flex items-center justify-center ">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                    {item.label}
                  </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-4 space-y-3">

            {/* Coverage Area */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 bg-white/20 rounded-lg p-1">
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-green-600 flex-shrink-0 animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-green-500 animate-ping" />
              </div>
              <div>
                <span className="text-white/80 text-sm font-medium block">Coverage Area</span>
                <span className="text-white/50 text-xs">25 km radius</span>
              </div>
            </div>

            {/* Center Point */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 bg-white/20 rounded-lg p-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-white/80 text-sm font-medium block">Center Point</span>
                <span className="text-white/50 text-xs">Rideegama</span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-white/20">
            <p className="text-white/50 text-xs text-center">
              Click markers for details • Zoom for better view
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default MapLegend