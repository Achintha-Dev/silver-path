import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

// icons
import { ImLeaf, ImList, ImSearch } from 'react-icons/im'
import { FaUsers, FaHiking, FaPray, FaLandmark, FaTh, FaFilter, FaTimes, FaExpand, FaCompress, FaSearch, FaMapMarkerAlt } from "react-icons/fa";

// components
import Navbar from '../../components/user/Navbar'
import Body from '../../components/user/Body'
import MapComponent from '../../components/user/map/MapComponent'
import MapSidebar from '../../components/user/map/MapSidebar'
import MapLegend from '../../components/user/map/MapLegend'
import api from '../../utils/api'

const CATEGORIES = [
    { label: 'All', icon: <FaTh className='text-sm'/>, color: 'text-white border-white/20 bg-white/10' },
    { label: 'Nature', icon: <ImLeaf className='text-sm'/>, color: 'bg-green-500/10 text-green-400 border-green-200/20' },
    { label: 'Heritage', icon: <FaLandmark className='text-sm'/>, color: 'bg-amber-200/10 text-amber-400 border-amber-200/20' },
    { label: 'Religious', icon: <FaPray className='text-sm'/>, color: 'bg-purple-500/10 text-purple-400 border-purple-200/20' },
    { label: 'Cultural', icon: <FaUsers className='text-sm'/>, color: 'bg-red-500/10 text-red-400 border-red-200/20' },
    { label: 'Recreational', icon: <FaHiking className='text-sm'/>, color: 'bg-teal-500/10 text-teal-400 border-teal-200/20' },
]

const MapPage = () => {
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Default sidebar to false on mobile, true on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [fullscreen, setFullscreen] = useState(false);

  const highlightId = searchParams.get('highlight');

  // Filter destinations based on category and search
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;

    // Category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(d => d.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query)
      );
    }

    return filtered
  }, [destinations, activeCategory, searchQuery]);

  useEffect(() => {
    setFiltered(filteredDestinations);
  }, [filteredDestinations]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        setDestinations(res.data.data);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, [])

  return (
    <Body>
      <Navbar className="" />

      <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'pt-16'} flex flex-col h-screen`}>

        {/* Top Bar */}
        {!fullscreen && (
          <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-4 shadow-lg">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">

              {/* Title & Stats */}
              <div className="flex items-center justify-between w-full lg:w-auto lg:flex-1">
                <div className="flex items-center gap-4">

                  <div>
                    <h1 className="text-white font-black uppercase tracking-wider text-lg lg:text-xl">
                      Interactive Map
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-white/70 text-sm font-medium">
                        {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
                      </p>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <FaMapMarkerAlt className="text-blue-300" />
                        <span>25km radius</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200"
                  >
                    <FaSearch className="text-lg" />
                  </button>
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200"
                  >
                    {sidebarOpen ? <FaTimes className="text-lg" /> : <ImList className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden lg:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Controls */}
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-3 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200 font-medium"
                >
                  {sidebarOpen ? <FaTimes className='text-lg' /> : <ImList className='text-lg' />}
                  <span className="text-sm">{sidebarOpen ? 'Hide List' : 'Show List'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            {isSearchOpen && (
              <div className="lg:hidden mb-4 animate-in slide-in-from-top-2 duration-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:justify-center">

              <div className="px-2 py-2 flex gap-3 md:rounded-xl md:bg-white/10 border md:border-white/20 border-transparent">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    to={`/destinations?category=${cat.label}`}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-300 whitespace-nowrap hover:-translate-y-1 hover:shadow-lg ${cat.color} backdrop-blur-sm ${
                    activeCategory === cat.label
                      ? 'ring-2 ring-white/50 border-white/50 brightness-125 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'opacity-70 hover:opacity-100 border-transparent'
                  }`}
                  >
                    <span key={cat.id} style={{ fontSize: '16px'}}  className={`transition-transform duration-500 ${activeCategory === cat.label ? 'rotate-[360deg]' : ''}`}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Enhanced Sidebar */}
          <div className={`
            flex-shrink-0 bg-black/40 md:bg-white/10 backdrop-blur-md border-r border-white/20
            transition-all duration-300 ease-in-out overflow-hidden shadow-xl
            ${sidebarOpen ? 'w-full md:w-80 lg:w-96 opacity-100' : 'w-0 opacity-0'}
            absolute md:relative inset-0 z-[1001] md:z-auto
          `}>
            {sidebarOpen && (
              <div className="h-full flex flex-col">
                <div className="md:hidden p-4 border-b border-white/20 flex justify-between items-center bg-white/5">
                   <span className="text-white font-black text-sm uppercase tracking-wider">Destinations</span>
                   <button
                     onClick={() => setSidebarOpen(false)}
                     className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                   >
                     <FaTimes />
                   </button>
                </div>
                <MapSidebar
                  destinations={filtered}
                  loading={loading}
                  activeId={activeId}
                  onHover={setActiveId}
                  searchQuery={searchQuery}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <MapComponent
              destinations={filtered}
              activeId={activeId}
              highlightId={highlightId}

              // Fullscreen control props
              isFullscreen={fullscreen}
              setFullscreen={setFullscreen}
            />

            {/* Enhanced Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] scale-90 md:scale-100 origin-bottom-left">
              <MapLegend />
            </div>

            {/* Search Results Counter */}
            {searchQuery && (
              <div className="absolute top-4 left-4 z-[1000] bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-white text-sm font-medium shadow-lg ">
                Found {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </Body>
  )
}

export default MapPage