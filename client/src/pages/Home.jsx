import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategoryBadge from '../components/CategoryBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../utils/api'

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/destinations?limit=3')
        setFeatured(res.data.data.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch featured destinations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${searchQuery.trim()}`)
    } else {
      navigate('/destinations')
    }
  }

  const categories = [
    { label: 'Nature', icon: '🌿', color: 'bg-green-100 text-green-800 border-green-300' },
    { label: 'Heritage', icon: '🏛️', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { label: 'Religious', icon: '🕌', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { label: 'Cultural', icon: '🎭', color: 'bg-red-100 text-red-800 border-red-300' },
    { label: 'Recreational', icon: '🎯', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  ]

  const features = [
    {
      icon: '🗺️',
      title: 'Interactive map',
      desc: 'View all destinations on a live map with 25 km radius overlay and color-coded category markers.',
      link: '/map',
      bg: 'bg-green-50'
    },
    {
      icon: '📅',
      title: 'One-day planner',
      desc: 'Select multiple places and get a suggested visiting order with distance calculations.',
      link: '/planner',
      bg: 'bg-amber-50'
    },
    {
      icon: '🔍',
      title: 'Smart filtering',
      desc: 'Filter by category, distance range, and keywords to find exactly what you need.',
      link: '/destinations',
      bg: 'bg-purple-50'
    },
  ]

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative bg-neutral min-h-[560px] flex items-center justify-center overflow-hidden">

        {/* Background grid pattern */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full h-full"
              style={{
                background: ['#2d5e4e','#8B6914','#4a5c8a','#6B4E2A','#2d5e4e','#7a5c1e'][i]
              }}
            />
          ))}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-neutral/70" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="text-primary text-xs font-medium tracking-[4px] uppercase mb-4">
            Rideegama · Kurunegala · Sri Lanka
          </p>

          <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
            Discover the{' '}
            <span className="text-primary">hidden gems</span>
            <br />of Rideegama
          </h1>

          <p className="text-white/70 text-base mb-8 leading-relaxed">
            Plan your perfect one-day visit to 10+ places of interest
            within 25 km of Rideegama, Kurunegala
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex bg-white rounded-lg overflow-hidden max-w-lg mx-auto mb-8">
            <input
              type="text"
              placeholder="Search temples, nature spots, heritage sites..."
              className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary hover:bg-yellow-500 px-5 py-3 text-sm font-medium text-neutral transition-colors"
            >
              Explore
            </button>
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-10">
            {[
              { num: '10+', label: 'Destinations' },
              { num: '25km', label: 'Radius' },
              { num: '5', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-medium text-primary">{stat.num}</div>
                <div className="text-xs text-white/60 tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Pills ───────────────────────────── */}
      <section className="bg-base-200 border-b border-base-300">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={`/destinations?category=${cat.label}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-transform hover:-translate-y-0.5 ${cat.color}`}
            >
              <span style={{ fontSize: '14px' }}>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Destinations ────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium text-base-content">Featured destinations</h2>
            <p className="text-base-content/50 text-sm mt-1">Top picks within 25 km of Rideegama</p>
          </div>
          <Link
            to="/destinations"
            className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading destinations..." />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((dest) => (
              <DestinationCard key={dest._id} dest={dest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-base-content/40">
            <p className="text-4xl mb-3">🏝️</p>
            <p>No destinations yet — check back soon!</p>
          </div>
        )}
      </section>

      {/* ── Why Silver Path ──────────────────────────── */}
      <section className="bg-base-200 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-base-content">Why use Silver Path?</h2>
            <p className="text-base-content/50 text-sm mt-2">Everything you need for a perfect day trip</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-base-100 rounded-xl border border-base-300 p-6 hover:-translate-y-1 transition-transform block"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <span style={{ fontSize: '22px' }}>{feature.icon}</span>
                </div>
                <h3 className="font-medium text-base-content mb-2">{feature.title}</h3>
                <p className="text-sm text-base-content/60 leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium text-base-content">Plan your day in 3 steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Browse destinations',
              desc: 'Explore all places of interest, filter by category and distance.',
              color: 'text-amber-500'
            },
            {
              step: '02',
              title: 'Add to your plan',
              desc: 'Select the places you want to visit and add them to your itinerary.',
              color: 'text-green-600'
            },
            {
              step: '03',
              title: 'Get your route',
              desc: 'View your optimized visiting order with distance information.',
              color: 'text-purple-600'
            },
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className={`text-5xl font-medium ${step.color} mb-4 opacity-30`}>
                {step.step}
              </div>
              <h3 className="font-medium text-base-content mb-2">{step.title}</h3>
              <p className="text-sm text-base-content/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section className="bg-neutral mx-6 mb-14 rounded-2xl py-14 px-8 text-center">
        <h2 className="text-2xl font-medium text-white mb-3">
          Ready to plan your perfect day?
        </h2>
        <p className="text-white/60 text-sm mb-8">
          Explore 10+ destinations within 25 km of Rideegama, Kurunegala
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/destinations"
            className="bg-primary hover:bg-yellow-500 text-neutral font-medium px-8 py-3 rounded-lg text-sm transition-colors"
          >
            Browse destinations
          </Link>
          <Link
            to="/map"
            className="border border-white/30 hover:border-white/60 text-white font-medium px-8 py-3 rounded-lg text-sm transition-colors"
          >
            View on map
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="bg-neutral text-neutral-content border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-primary font-medium tracking-widest text-lg">SILVER PATH</p>
            <p className="text-white/40 text-xs mt-1">Local Tourist Day-Visit Planner · Rideegama, Kurunegala</p>
          </div>
          <div className="flex gap-6 text-sm text-white/50">
            <Link to="/destinations" className="hover:text-primary transition-colors">Destinations</Link>
            <Link to="/map" className="hover:text-primary transition-colors">Map</Link>
            <Link to="/planner" className="hover:text-primary transition-colors">Planner</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Destination Card Component ────────────────────
const DestinationCard = ({ dest }) => {
  return (
    <Link
      to={`/destinations/${dest._id}`}
      className="bg-base-100 rounded-xl border border-base-300 overflow-hidden hover:-translate-y-1 transition-transform block card-hover"
    >
      {/* Image */}
      <div className="h-44 bg-base-300 relative overflow-hidden">
        {dest.images?.[0]?.url ? (
          <img
            src={dest.images[0].url}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-base-200">
            <span className="text-4xl opacity-30">🏝️</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={dest.category} />
        </div>

        {/* Distance badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {dest.distanceFromRideegama} km away
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-medium text-base-content mb-1 line-clamp-1">{dest.name}</h3>
        <p className="text-xs text-base-content/60 line-clamp-2 leading-relaxed mb-3">
          {dest.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-base-content/40">
            🕐 {dest.openingHours}
          </span>
          <span className="text-xs text-amber-700 font-medium">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default Home