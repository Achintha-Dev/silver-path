import React, { useState } from 'react'

function Hero({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { num: '10+', label: 'Destinations' },
    { num: '25km', label: 'Radius' },
    { num: '5', label: 'Categories' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    
    <section className="relative min-h-[580px] overflow-hidden ">
      
      <div className="relative z-20 flex min-h-[580px] items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center text-white">

          <p className="text-gray-300 text-xs font-medium tracking-[4px] uppercase mb-4 mt-4 ">
            Rideegama · Kurunegala · Sri Lanka
          </p>

          {/* Main headline */}
          <h1 className="font-['Montserrat'] text-3xl font-black bg-gradient-to-br from-white/80 via-white/20 to-white/70 bg-clip-text text-transparent uppercase md:text-6xl">
            Discover the hidden gems of Rideegama
          </h1>

          {/* Description text */}
          <p className="font-['Montserrat'] text-white/70 text-base md:text-lg mb-8 leading-relaxed">
            Plan your perfect one-day visit to 10+ places of interest within 25 km of Rideegama, Kurunegala.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:flex-row md:items-center md:p-1 md:max-w-3xl mx-auto mb-8 shadow-2xl"
          >
            {/* Search Input */}
            <input
            id='text'
              type="text"
              placeholder="Search temples, nature spots, heritage sites..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Search Button */}
            <button
              type="submit"
              className="rounded-xl btn bg-white/10 backdrop-blur-lg px-8 py-3 text-sm font-bold border-white/40 text-white transition-all hover:scale-105 active:scale-95 md:mr-1 hover:bg-white/30"
            >
              EXPLORE
            </button>
          </form>

          <div className="flex flex-raw gap-4 sm:flex-row sm:justify-center sm:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-300/100 ">{stat.num}</div>
                <div className="text-xs text-white/60 tracking-widest uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero