import React from 'react'
import { FaLightbulb } from 'react-icons/fa'

function TravelTips({ destination }) {
    const tipsArray = destination.travelTips ? destination.travelTips.split('.').map(tip => tip.trim()).filter(tip => tip.length > 0) : [];
    
  return (
    <div>
        {tipsArray.length > 0 && (
            <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-400/20 rounded-2xl p-6">
            <h2 className="text-amber-400 font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                <FaLightbulb /> Travel Tips
            </h2>
            {tipsArray.map((tip, index) => (
                <p key={index} className="text-white/70 text-sm leading-relaxed mb-3 ml-5 text-justify md:text-left">
                   <li>{tip}.</li>
                </p>
            ))}
            </div>
        )}
    </div>
  )
}

export default TravelTips