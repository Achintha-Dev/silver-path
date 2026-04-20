import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaClock, FaCar, FaLocationArrow, FaArrowCircleRight } from 'react-icons/fa'
import { PiWarningFill, PiFlag, PiClock } from "react-icons/pi";
import { formatTime, formatClock } from '../../../../utils/distance'
import { useMemo } from 'react'

const CATEGORY_COLORS = {
  Nature:       'bg-green-500/20 text-green-400 border-green-400/20',
  Heritage:     'bg-amber-500/20 text-amber-400 border-amber-400/20',
  Religious:    'bg-purple-500/20 text-purple-400 border-purple-400/20',
  Cultural:     'bg-red-500/20 text-red-400 border-red-400/20',
  Recreational: 'bg-teal-500/20 text-teal-400 border-teal-400/20',
}

const START_HOUR = 8

const ItineraryTab = ({ itinerary, totalDistance, userLocationUsed }) => {

  const { stops, totalTime } = useMemo(() => {
    const stops = itinerary.reduce((acc, dest, index) => {
      const travelTime = dest.travelTime || 0
      const visitTime = dest.visitTime || 60

      // Get the previous departure time (0 for the first stop)
      const prevDepartureMinutes = index === 0 ? 0 : acc[index - 1].departureMinutes

      const arrivalMinutes = prevDepartureMinutes + travelTime
      const departureMinutes = arrivalMinutes + visitTime

      acc.push({
        ...dest,
        arrivalMinutes,
        departureMinutes,
        arrivalTime: formatClock(START_HOUR, arrivalMinutes),
        departureTime: formatClock(START_HOUR, departureMinutes),
      })

      return acc
    }, [])

    const totalTime = stops.length > 0 ? stops[stops.length - 1].departureMinutes : 0

    return { stops, totalTime }
  }, [itinerary]);

  return (
    <div className="space-y-3">

      {/* Summary */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
              Your Day Plan
            </p>
            <p className="text-white font-black">
              {itinerary.length} stops · {formatTime(totalTime)} total
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              {totalDistance.toFixed(1)} km · Starts at {formatClock(START_HOUR, 0)}
            </p>
          </div>
          {userLocationUsed && (
            <span className="px-3 py-1.5 bg-green-500/10 border border-green-400/20 rounded-lg text-green-300 text-[10px] font-bold uppercase tracking-wider">
              <FaLocationArrow className="inline-block mr-1" /> Your Location Used
            </span>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-2.5">
        <p className="text-amber-300/70 text-sm md:text-left text-center">
          <PiWarningFill className="inline-block mr-1 text-lg mb-1" /> Distances are straight-line estimates.
          Times are approximate based on category visit durations.
        </p>
      </div>

      {/* Stops */}
      <div className="space-y-3 sm:space-y-2">
        {stops.map((dest, i) => (
          <div key={dest._id}>
            {/* Show travel from start point for first stop too */}
            {i === 0 && dest.travelTime > 0 && (
              <div className="flex items-center gap-3 px-4 py-1 ml-4 mb-1">
                <FaCar className="text-white/80 text-xs flex-shrink-0" />
                <span className="text-white/80 text-[10px] uppercase tracking-widest">
                  From {userLocationUsed ? 'your location' : 'Rideegama'} ·{' '}
                  {dest.distanceFromStart?.toFixed(1) || '?'} km ·{' '}
                  {formatTime(dest.travelTime)}
                </span>
              </div>
            )}

            {/* Travel connector between stops */}
            {i > 0 && (
              <div className="flex items-center gap-3 px-4 py-1.5 ml-4">
                <FaCar className="text-white/80 text-xs flex-shrink-0" />
                <span className="text-white/80 text-[10px] uppercase tracking-widest">
                  {formatTime(dest.travelTime || 0)} · {dest.distanceFromPrev?.toFixed(1) || '?'} km
                </span>
              </div>
            )}

            {/* Destination Plan Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-all">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                
                {/* Top Row: Index and Info (Mobile Optimization) */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-[10px] sm:text-xs">{i + 1}</span>
                  </div>
                  
                  <img
                    src={dest.images?.[0]?.url || 'https://placehold.co/56x56'}
                    alt={dest.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover flex-shrink-0 border border-white/10"
                  />

                  {/* Mobile Header: Name and Category */}
                  <div className="flex-1 min-w-0 sm:hidden">
                    <h3 className="text-white font-black text-xs uppercase tracking-tight truncate leading-tight">
                      {dest.name}
                    </h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase border ${CATEGORY_COLORS[dest.category]}`}>
                      {dest.category}
                    </span>
                  </div>
                </div>

                {/* Desktop Content Section */}
                <div className="flex-1 min-w-0">
                  {/* Desktop Header */}
                  <div className="hidden sm:flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight truncate">
                      {dest.name}
                    </h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border ${CATEGORY_COLORS[dest.category]}`}>
                      {dest.category}
                    </span>
                  </div>

                  {/* Timing Grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-white/70 text-[11px] sm:text-sm">
                      <FaClock className="text-blue-400 text-xs" />
                      <span className="font-mono">{dest.arrivalTime} — {dest.departureTime}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-[11px]">
                      <FaMapMarkerAlt className="text-green-400" />
                      ~{formatTime(dest.visitTime || 60)} visit
                    </span>
                  </div>

                  {/* Extra Info */}
                  <p className="text-white/60 text-[11px] sm:text-sm mt-2 sm:mt-1 truncate flex items-center">
                    <PiClock className="inline-block mr-1.5 text-base text-white/40" />
                    <span className="truncate">Open: {dest.openingHours}</span>
                  </p>
                </div>
              </div>

              {/* Footer Action */}
              <div className="border-t border-white/5 px-4 py-2 flex justify-end bg-black/10 " title='view destination details'>
                <Link
                  to={`/destinations/${dest._id}`}
                  className="text-white/40 hover:text-white text-[9px] sm:text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-1 p-1 bg-white/10 rounded-lg"
                >
                  Details <FaArrowCircleRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* End marker */}
        <div className="flex items-center gap-3 px-4 ml-4 py-2 text-white/60 border-l-2 border-white/5">
          <PiFlag className="text-lg text-red-500" />
          <span className="text-[10px] uppercase tracking-widest font-black">
            End · {formatClock(START_HOUR, totalTime)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ItineraryTab