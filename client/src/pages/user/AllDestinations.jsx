import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import Body from '../../components/user/Body'
import SearchBar from '../../components/user/destinations/SearchBar'
import FilterBar from '../../components/user/destinations/FilterBar'
import DestinationGrid from '../../components/user/destinations/DestinationGrid'
import api from '../../utils/api'

import { IoClose } from 'react-icons/io5'

const AllDestinations = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Read filters from URL params — so filters are shareable/bookmarkable
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'All'
  const distance = searchParams.get('distance') || ''

  // Update URL params
  const updateParams = (updates) => {
    const current = Object.fromEntries(searchParams.entries())
    const next = { ...current, ...updates }

    // Remove empty values from URL
    Object.keys(next).forEach(key => {
      if (!next[key] || next[key] === 'All') delete next[key]
    })

    setSearchParams(next)
  }

  // Fetch destinations from API
  const fetchDestinations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== 'All') params.append('category', category)
      if (distance) params.append('distance', distance)

      const res = await api.get(`/destinations?${params.toString()}`)
      setTotalCount(res.data.data.length)

      // Client-side search filter (name + description)
      const filtered = search
        ? res.data.data.filter(d =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.description.toLowerCase().includes(search.toLowerCase())
          )
        : res.data.data

      setDestinations(filtered)

    } catch (error) {
      console.error('Failed to fetch destinations:', error)
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }, [category, distance, search])

  useEffect(() => {
    fetchDestinations()
  }, [fetchDestinations])

  const handleClearFilters = () => {
    setSearchParams({})
  }

  return (
    <Body>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <p className="text-white/40 text-xs uppercase tracking-[4px] mb-2 text-center">
            Rideegama · Kurunegala · Sri Lanka
          </p>
          <h1 className="text-4xl md:text-5xl font-black font-['Montserrat'] text-white uppercase tracking-tighter mb-3 text-center">
            Destinations
          </h1>
          <p className="text-white/50 text-sm text-center">
            {loading
              ? 'Loading...'
              : `${destinations.length} of ${totalCount} places found within 25 km of Rideegama`
            }
          </p>
        </div>

        {/* ── Filters Section ── */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8 space-y-4">
          <SearchBar
            value={search}
            onChange={(val) => updateParams({ search: val })}
            onClear={() => updateParams({ search: '' })}
          />
          <FilterBar
            activeCategory={category}
            activeDistance={distance}
            onCategoryChange={(val) => updateParams({ category: val })}
            onDistanceChange={(val) => updateParams({ distance: val })}
          />

          {/* Active filters indicator */}
          {(search || category !== 'All' || distance) && (
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/40 text-xs uppercase tracking-widest">
                  Active filters:
                </span>
                {search && (
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-white text-xs font-bold">
                    "{search}"
                  </span>
                )}
                {category !== 'All' && (
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-white text-xs font-bold">
                    {category}
                  </span>
                )}
                {distance && (
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-white text-xs font-bold">
                    ≤ {distance} km
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors font-bold bg-white/10 rounded p-1 hover:bg-white/20"
              >

                Clear all <IoClose className='inline-block text-lg'/>

              </button>
            </div>
          )}
        </div>

        {/* ── Destinations Grid ── */}
        <DestinationGrid
          destinations={destinations}
          loading={loading}
          search={search}
          onClearFilters={handleClearFilters}
        />
      </div>

      <Footer />
    </Body>
  )
}

export default AllDestinations