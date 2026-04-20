import { useState } from 'react'
import { ImLeaf } from 'react-icons/im'
import { FaSearch, FaPlus, FaCheck, FaUsers, FaHiking, FaPray, FaLandmark, FaLessThanEqual, FaTh } from 'react-icons/fa'

const CATEGORY_COLORS = {
  Nature:       'bg-green-500/20 text-green-400',
  Heritage:     'bg-amber-500/20 text-amber-400',
  Religious:    'bg-purple-500/20 text-purple-400',
  Cultural:     'bg-red-500/20 text-red-400',
  Recreational: 'bg-teal-500/20 text-teal-400',
}

const categories = [
    { label: 'All', icon: <FaTh className='text-sm'/>, color: 'text-white border-white/20 bg-white/10' },
    { label: 'Nature', icon: <ImLeaf className='text-sm'/>, color: 'bg-green-500/10 text-green-400 border-green-200/20 shadow-lg' },
    { label: 'Heritage', icon: <FaLandmark className='text-sm'/>, color: 'bg-amber-200/10 text-amber-400 border-amber-200/20 shadow-lg' },
    { label: 'Religious', icon: <FaPray className='text-sm'/>, color: 'bg-purple-500/10 text-purple-400 border-purple-200/20 shadow-lg' },
    { label: 'Cultural', icon: <FaUsers className='text-sm'/>, color: 'bg-red-500/10 text-red-400 border-red-200/20 shadow-lg' },
    { label: 'Recreational', icon: <FaHiking className='text-sm'/>, color: 'bg-teal-500/10 text-teal-400 border-teal-200/20 shadow-lg' },
  ]

const PlannerPicker = ({ destinations, selected, onAdd, onRemove, loading }) => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const isSelected = (id) => selected.some(s => s._id === id)

  const filtered = destinations.filter(dest => {
    const matchSearch = dest.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || dest.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-white/10 space-y-3 flex-shrink-0">
        <h3 className="text-white font-black uppercase tracking-wider text-xs">
          Choose Destinations
          <span className="text-white/30 font-normal ml-2 normal-case">
            ({selected.length} selected)
          </span>
        </h3>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-3 py-2 text-white text-xs placeholder:text-white/30 outline-none focus:border-white/40 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-2 px-2 py-1 rounded-full text-sm font-black uppercase tracking-wider border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.color} backdrop-blur-sm ${
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

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/30 text-xs uppercase tracking-widest">
              No destinations found
            </p>
          </div>
        ) : (
          filtered.map(dest => {
            const sel = isSelected(dest._id)
            return (
              <div
                key={dest._id}
                className={`flex items-center gap-3 p-3 border-b border-white/5 transition-all ${
                  sel ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <img
                  src={dest.images?.[0]?.url || 'https://placehold.co/40x40'}
                  alt={dest.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{dest.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${CATEGORY_COLORS[dest.category]}`}>
                      {dest.category}
                    </span>
                    <span className="text-white/40 text-[10px]">
                      {dest.distanceFromRideegama} km
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => sel ? onRemove(dest._id) : onAdd(dest)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    sel
                      ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {sel ? <FaCheck className="text-xs" /> : <FaPlus className="text-xs" />}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default PlannerPicker