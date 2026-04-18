import React from 'react'

function Description({ destination }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black uppercase tracking-wider text-sm mb-4 border-b border-white/10 pb-3">
        About This Place
        </h2>
        <p className="text-white/70 text-sm leading-relaxed text-justify">
        {destination.description}
        </p>
    </div>
  )
}

export default Description