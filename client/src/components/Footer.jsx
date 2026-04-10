import React from 'react'
import { Link } from 'react-router-dom'
import { FaGripfire  } from "react-icons/fa";
function Footer() {
  return (
    <footer className="relative bg-white/10 backdrop-blur-lg text-neutral-content border-t border-white/20 overflow-hidden">
        

        {/* Content Layer */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-3">
                    <div className="h-px w-6 bg-white/30 hidden sm:block"></div> 
                    <p className="text-white font-black font-['Montserrat'] tracking-[0.2em] text-2xl flex items-center gap-2">
                        SILVER 
                        <FaGripfire className="w-5 h-7 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        PATH
                    </p>
                    <div className="h-px w-6 bg-white/30 hidden sm:block"></div>
                </div>
                <p className="text-white/50 text-[10px] uppercase tracking-widest mt-3 text-center md:text-left">
                    Local Tourist Day-Visit Planner · Rideegama, Kurunegala
                </p>
            </div>
            
            {/* Navigation Links - Updated to match Nav Style */}
            <div className="flex gap-10 text-[11px] font-bold uppercase tracking-[0.15em]">
                <Link to="/destinations" className="text-white/60 hover:text-white transition-all hover:tracking-[0.25em]">Destinations</Link>
                <Link to="/map" className="text-white/60 hover:text-white transition-all hover:tracking-[0.25em]">Map</Link>
                <Link to="/planner" className="text-white/60 hover:text-white transition-all hover:tracking-[0.25em]">Planner</Link>
            </div>
        </div>

        {/* Sub-footer/Copyright bar */}
        <div className="relative z-20 border-t border-white/10 py-6 text-center bg-black/20">
            <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium">
                © {new Date().getFullYear()} Silver Path Rideegama · Exploring the heart of Sri Lanka
            </p>
        </div>
    </footer>
  )
}

export default Footer