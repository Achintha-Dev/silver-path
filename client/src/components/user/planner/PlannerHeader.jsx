import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle, FaSave } from 'react-icons/fa'

const LocationBadge = ({ status }) => {
  if (status === 'loading') return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-xl w-fit">
      <FaSpinner className="text-blue-400 text-xs animate-spin" />
      <span className="text-blue-300 text-xs font-medium">Getting your location...</span>
    </div>
  )

  if (status === 'granted') return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-400/20 rounded-xl w-fit">
      <FaMapMarkerAlt className="text-green-400 text-xs" />
      <span className="text-green-300 text-xs font-medium">
        Using your current location for nearest suggestions
      </span>
    </div>
  )

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-400/20 rounded-xl w-fit">
      <FaExclamationTriangle className="text-amber-400 text-xs" />
      <span className="text-amber-300 text-xs font-medium">
        Using Rideegama center as reference point
      </span>
    </div>
  )
}

const PlannerHeader = ({ locationStatus, isRestoredSession, onClearAll }) => {
  return (
    <div className="mb-8 space-y-4">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-[4px] mb-2 text-center md:text-left">
          Day Trip Planner
        </p>
        <h1 className="text-4xl md:text-5xl font-black font-['Montserrat'] text-white uppercase tracking-tighter mb-2 text-center md:text-left">
          Plan Your Visit
        </h1>
        <p className="text-white/50 text-sm max-w-xl text-center md:text-left">
          Select destinations, generate an optimized visiting order
          and get real road directions for your perfect day trip.
        </p>
      </div>

      <LocationBadge status={locationStatus} />

      {/* Restored session notice */}
      {isRestoredSession && (
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-xl w-fit">
          <span className="text-blue-300 text-xs font-medium">
            <FaSave className="inline-block mr-1" /> Your previous plan has been restored
          </span>
          <button
            onClick={onClearAll}
            className="text-blue-400/60 hover:text-blue-300 text-xs underline transition-colors"
          >
            Start fresh
          </button>
        </div>
      )}
    </div>
  )
}

export default PlannerHeader