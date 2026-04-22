import React from 'react'
import { FaClock, FaMoneyBillWave, FaTools, FaWifi, FaPlus, FaMapMarkerAlt} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import StarRating from '../StarRating'

function Information( { destination } ) {
  const facilitiesArray = destination.facilities ? destination.facilities.split('.').map(fac => fac.trim()).filter(fac => fac.length > 0) : [];
  
  return (
    <div className="space-y-4">

            {/* Quick Info Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-black uppercase tracking-wider text-sm border-b border-white/10 pb-3">
                Visit Information
              </h2>

              {/* Distance */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-green-400 text-sm" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">
                    Distance from Rideegama
                  </p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    {destination.distanceFromRideegama} km
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-blue-400 text-sm" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">
                    Opening Hours
                  </p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    {destination.openingHours}
                  </p>
                </div>
              </div>

              {/* Entry Fee */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaMoneyBillWave className="text-amber-400 text-sm" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">
                    Entry Fee
                  </p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    {destination.entryFee || 'Free'}
                  </p>
                </div>
              </div>

              {/* Facilities */}
              {destination.facilities && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaTools className="text-purple-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">
                      Facilities
                    </p>
                    {facilitiesArray.map((fac, index) => (
                      <p key={index} className="text-white font-bold text-sm mt-0.5 ml-3 text-justify">
                        <li>{fac}.</li>
                        <br/>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* GPS Coordinates */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaWifi className="text-teal-400 text-sm" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">
                    GPS Coordinates
                  </p>
                  <p className="text-white font-bold text-xs mt-0.5 font-mono">
                    {destination.location.lat}° N
                  </p>
                  <p className="text-white font-bold text-xs font-mono">
                    {destination.location.lng}° E
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-black uppercase tracking-wider text-sm mb-4 border-b border-white/10 pb-3">
                  Rate This Place
                </h2>

                <StarRating
                  destinationId={destination._id}
                  showCount={true}
                  size="lg"
                  readOnly={false}
                />
              </div>

            </div>

            {/* Add to Planner CTA */}
            <Link
              to={`/planner?add=${destination._id}`}
              className="flex items-center justify-center gap-2 w-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-wider py-4 rounded-2xl transition-all hover:scale-[1.02] text-sm"
            >
              <FaPlus /> Add to Day Plan
            </Link>

            {/* View on Map CTA */}
            <Link
              to={`/map?highlight=${destination._id}`}
              className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white font-bold uppercase tracking-wider py-4 rounded-2xl transition-all text-sm"
            >
              <FaMapMarkerAlt /> View on Map
            </Link>

            {/* Coordinates copy button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${destination.location.lat}, ${destination.location.lng}`
                )
                alert('Coordinates copied!')
              }}
              className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 font-bold uppercase tracking-wider py-3 rounded-2xl transition-all text-xs"
            >
              Copy GPS Coordinates
            </button>
          </div>
  )
}

export default Information