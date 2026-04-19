import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

// icons
import { ImLeaf, ImList } from 'react-icons/im'
import { FaUsers, FaHiking, FaPray, FaLandmark, FaTh, FaFilter, FaTimes, FaExpand, FaCompress } from "react-icons/fa";

// components
import Navbar from '../../components/user/Navbar'
import Body from '../../components/user/Body'
import MapComponent from '../../components/user/map/MapComponent'
import MapSidebar from '../../components/user/map/MapSidebar'
import MapLegend from '../../components/user/map/MapLegend'
import api from '../../utils/api'

const CATEGORIES = [
    { label: 'All', icon: <FaTh />, color: 'text-white border-white/20 bg-white/10' },
    { label: 'Nature', icon: <ImLeaf className='text-lg'/>, color: 'bg-green-500/10 text-green-400 border-green-200/20' },
    { label: 'Heritage', icon: <FaLandmark className='text-xl'/>, color: 'bg-amber-200/10 text-amber-400 border-amber-200/20' },
    { label: 'Religious', icon: <FaPray className='text-xl'/>, color: 'bg-purple-500/10 text-purple-400 border-purple-200/20' },
    { label: 'Cultural', icon: <FaUsers className='text-xl'/>, color: 'bg-red-500/10 text-red-400 border-red-200/20' },
    { label: 'Recreational', icon: <FaHiking className='text-xl'/>, color: 'bg-teal-500/10 text-teal-400 border-teal-200/20' },
]

const MapPage = () => {
  const [searchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  
  // Default sidebar to false on mobile, true on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [fullscreen, setFullscreen] = useState(false)

  const highlightId = searchParams.get('highlight')

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations')
        setDestinations(res.data.data)
        setFiltered(res.data.data)
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  useEffect(() => {
    if (activeCategory === 'All') {
      setFiltered(destinations)
    } else {
      setFiltered(destinations.filter(d => d.category === activeCategory))
    }
  }, [activeCategory, destinations])

  return (
    <Body>
      <Navbar />

      <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'pt-16'} flex flex-col h-screen bg-slate-950`}>

        {/* ── Top Bar (Responsive) ── */}
        {!fullscreen && (
          <div className="bg-black/40 backdrop-blur-2xl border-b border-white/10 px-4 py-3 flex flex-col md:flex-row items-center gap-3 overflow-hidden">
            
            {/* Header Info */}
            <div className="flex items-center justify-between w-full md:w-auto md:border-r md:border-white/10 md:pr-4">
              <div>
                <h1 className="text-white font-black uppercase tracking-wider text-[10px] md:text-sm">
                  Interactive Map
                </h1>
                <p className="text-white/40 text-[9px] uppercase tracking-widest leading-none">
                  {filtered.length} Dest.
                </p>
              </div>
              
              {/* Mobile Only: Close/Open List toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                {sidebarOpen ? <FaTimes /> : <FaFilter />}
              </button>
            </div>

            {/* Scrollable Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar p-1">
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap transition-all ${cat.color} ${
                      activeCategory === cat.label
                        ? 'ring-2 ring-white/50 border-white/50 brightness-125 shadow-lg scale-105'
                        : 'opacity-60 border-transparent hover:opacity-100'
                    }`}
                  >
                    <span className={activeCategory === cat.label ? 'rotate-[360deg] transition-transform duration-500' : ''}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 px-8 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold uppercase transition-all"
              >
                {sidebarOpen ? <FaTimes className='text-xl'/> : <FaFilter className='text-xl'/>}
                <span>{sidebarOpen ? 'Hide' : 'Show'} List</span>
              </button>

              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
              >
                {fullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        )}

        {/* Main Area */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Sidebar (Mobile Overlay / Desktop Side) */}
          <div className={`
            flex-shrink-0 bg-slate-900/95 backdrop-blur-2xl border-r border-white/10
            transition-all duration-500 ease-in-out overflow-hidden
            ${sidebarOpen ? 'w-full md:w-72 lg:w-80 opacity-100' : 'w-0 opacity-0'}
            absolute md:relative inset-0 z-[1001] md:z-auto
          `}>
            {sidebarOpen && (
              <div className="h-full flex flex-col">
                <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center">
                   <span className="text-white font-black text-xs uppercase">Destination List</span>
                   <button onClick={() => setSidebarOpen(false)} className="text-white/60 p-2"><FaTimes/></button>
                </div>
                <MapSidebar
                  destinations={filtered}
                  loading={loading}
                  activeId={activeId}
                  onHover={setActiveId}
                />
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="flex-1 relative">
            <MapComponent
              destinations={filtered}
              activeId={activeId}
              highlightId={highlightId}
            />

            {/* Floating Legend (Scaled for mobile) */}
            <div className="absolute bottom-4 left-4 z-[1000] scale-75 md:scale-100 origin-bottom-left">
              <MapLegend />
            </div>

            {/* Mobile List Re-open button */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden absolute bottom-4 right-4 z-[1000] flex items-center gap-2 px-4 py-3 bg-blue-600 border border-white/20 rounded-full text-white text-xs font-black uppercase shadow-2xl"
              >
                <ImList /> View List
              </button>
            )}
          </div>
        </div>
      </div>
    </Body>
  )
}

export default MapPage