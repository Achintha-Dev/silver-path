import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// components
import Navbar from '../components/user/Navbar'
import DestinationCard from '../components/user/DestinationCard'
import LoadingSpinner from '../components/user/LoadingSpinner'
import api from '../utils/api'
import Hero from '../components/user/Hero'
import Footer from '../components/user/Footer'
import Body from '../components/user/Body'

// icons
import { ImLeaf } from "react-icons/im";
import { FaUsers, FaHiking, FaMapMarkedAlt, FaCalendar, FaSearch, FaGripfire, FaRegArrowAltCircleRight, FaPray, FaLandmark } from "react-icons/fa";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/destinations?limit=3');
        setFeatured(res.data.data.slice(0, 3));

      } catch (error) {
        console.error('Failed to fetch featured destinations:', error);

      } finally {
        setLoading(false)
      }
    }
    fetchFeatured();
  }, []);


  // This function passed to the Hero component
  const handleHeroSearch = (query) => {
    if (query.trim()) {
      navigate(`/destinations?search=${query.trim()}`)
    } else {
      navigate('/destinations')
    }
  }

  const categories = [
    { label: 'NATURE', icon: <ImLeaf className='text-lg'/>, color: 'bg-green-500/10 text-green-400 border-green-200/20 shadow-lg' },
    { label: 'HERITAGE', icon: <FaLandmark className='text-xl'/>, color: 'bg-amber-200/10 text-amber-400 border-amber-200/20 shadow-lg' },
    { label: 'RELIGIOUS', icon: <FaPray className='text-xl'/>, color: 'bg-purple-500/10 text-purple-400 border-purple-200/20 shadow-lg' },
    { label: 'CULTURAL', icon: <FaUsers className='text-xl'/>, color: 'bg-red-500/10 text-red-400 border-red-200/20 shadow-lg' },
    { label: 'RECREATIONAL', icon: <FaHiking className='text-xl'/>, color: 'bg-teal-500/10 text-teal-400 border-teal-200/20 shadow-lg' },
  ]

  const features = [
    {
      icon: <FaMapMarkedAlt className='text-green-700'/>,
      title: 'Interactive map',
      desc: 'View all destinations on a live map with 25 km radius overlay and color-coded category markers.',
      link: '/map',
      bg: 'bg-green-50'
    },
    {
      icon: <FaCalendar className='text-amber-700'/>,
      title: 'One-day planner',
      desc: 'Select multiple places and get a suggested visiting order with distance calculations.',
      link: '/planner',
      bg: 'bg-amber-50'
    },
    {
      icon: <FaSearch className='text-purple-600'/>,
      title: 'Smart filtering',
      desc: 'Filter by category, distance range, and keywords to find exactly what you need.',
      link: '/destinations',
      bg: 'bg-purple-50'
    },
  ]

  return (
    // Page Wrapper
    <Body>

      <Navbar />
      <Hero onSearch={handleHeroSearch} />

      {/* ── Category Pills ── */}
      <section className="mx-auto md:-mt-12 sm:mt-10 mb-14 max-w-5xl rounded-full bg-white/5 backdrop-blur-lg border border-white/10 p-2 shadow-2xl">
        <div className="px-6 py-4 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={`/destinations?category=${cat.label}`}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.color} backdrop-blur-sm`}
            >
              <span style={{ fontSize: '16px' }}>{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Destinations ── */}
      <section className="max-w-7xl mx-auto px-10 mb-20 py-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-3xl font-black font-['Montserrat'] text-white uppercase tracking-tighter">
              Featured Destinations
            </h2>
            <p className="text-white/60 text-sm mt-1">Top picks within 25 km of Rideegama</p>
          </div>
          <Link
            to="/destinations"
            className="text-sm md:text-lg font-bold transition-colors text-white/80 hover:text-white group"
            title='View all destinations'
          >
            MORE <FaRegArrowAltCircleRight className="inline-block mb-1 text-sm md:text-2xl transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading destinations..." />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((dest) => (
              <DestinationCard key={dest._id} dest={dest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-5xl mb-4">🏝️</p>
            <p className="text-white/50">No destinations yet — check back soon!</p>
          </div>
        )}
      </section>

      {/* ── Why Silver Path ── */}
      <section className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-8 mb-20">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-['Montserrat'] uppercase text-white tracking-tighter">
              Why use Silver Path?
            </h2>
            <p className="text-white/60 text-sm mt-2 max-w-sm mx-auto">
              Everything you need for a perfect day trip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-white/5 rounded-2xl border border-white/10 p-8 shadow-xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 block backdrop-blur-lg"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 shadow-md border border-white/20 bg-white/30 backdrop-blur-3xl mx-auto md:mx-0`}>
                  <span style={{ fontSize: '26px' }}>{feature.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 py-10 -mt-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black font-['Montserrat'] uppercase text-white tracking-tighter">
            Plan your day in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
          {[
            {
              step: '01',
              title: 'Browse destinations',
              desc: 'Explore all places of interest, filter by category and distance.',
              color: 'text-amber-400 [text-shadow:0_2px_10px_rgb(251_191_36_/_30%)]'
            },
            {
              step: '02',
              title: 'Add to your plan',
              desc: 'Select the places you want to visit and add them to your itinerary.',
              color: 'text-green-500 [text-shadow:0_2px_10px_rgb(34_197_94_/_30%)]'
            },
            {
              step: '03',
              title: 'Get your route',
              desc: 'View your optimized visiting order with distance information.',
              color: 'text-purple-500 [text-shadow:0_2px_10px_rgb(168_85_247_/_30%)]'
            },
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className={`text-6xl font-extrabold ${step.color} mb-6 tracking-tighter`}>
                {step.step}
              </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
                  {step.title}
                </h3>
              <p className="text-sm text-white/70 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section 
        className="relative mx-12 mb-20 rounded-3xl py-24 px-10 text-center overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="absolute inset-0 z-10 bg-white/5 backdrop-blur-lg" />

        <div className="relative z-20">
          <FaGripfire className="w-12 h-12 text-blue-400 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-4xl font-black font-['Montserrat'] text-white mb-4 uppercase tracking-tighter">
            Ready to plan your perfect day?
          </h2>
          <p className="text-white/80 text-md mb-10 max-w-xl mx-auto font-medium">
            Explore 10+ iconic destinations within a 25 km radius of Rideegama, Kurunegala. Curated routes, easy maps.
          </p>
          
          {/* Button Group */}
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/destinations"
              className="btn bg-white/20 backdrop-blur-lg hover:bg-white/30 text-black font-black uppercase tracking-tight md:tracking-wider px-6 py-3.5 md:px-10 md:py-3.5 rounded-xl text-[10px] md:text-xs transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              Browse destinations
            </Link>
            <Link
              to="/map"
              className="btn bg-white/5 backdrop-blur-lg hover:bg-white/30 text-white font-black uppercase tracking-wider px-10 py-3.5 rounded-xl text-xs transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              View on map
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </Body>
    
  )
}

export default Home