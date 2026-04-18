import React from 'react'
import { FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa'

function ShareButton({ destination, handleShare }) {
  return (

    <div className="flex items-start justify-between gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-black font-['Montserrat'] text-white uppercase tracking-tighter">
                {destination.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-white/50">
                <FaMapMarkerAlt className="text-green-400 text-sm" />
                <span className="text-sm">{destination.address}</span>
            </div>
        </div>
        <button
        onClick={handleShare}
        className="flex-shrink-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
            <FaShareAlt /> Share
        </button>
    </div>
    
  )
}

export default ShareButton