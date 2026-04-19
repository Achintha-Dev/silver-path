import { ImLeaf } from 'react-icons/im'
import { FaUsers, FaHiking, FaPray, FaLandmark, FaLessThanEqual, FaTh } from "react-icons/fa";

const CATEGORIES = [
    { label: 'All', icon: <FaTh />, color: 'text-white border-white/20 bg-white/10' },
    { label: 'Nature', icon: <ImLeaf className='text-lg'/>, color: 'bg-green-500/10 text-green-400 border-green-200/20 shadow-lg' },
    { label: 'Heritage', icon: <FaLandmark className='text-xl'/>, color: 'bg-amber-200/10 text-amber-400 border-amber-200/20 shadow-lg' },
    { label: 'Religious', icon: <FaPray className='text-xl'/>, color: 'bg-purple-500/10 text-purple-400 border-purple-200/20 shadow-lg' },
    { label: 'Cultural', icon: <FaUsers className='text-xl'/>, color: 'bg-red-500/10 text-red-400 border-red-200/20 shadow-lg' },
    { label: 'Recreational', icon: <FaHiking className='text-xl'/>, color: 'bg-teal-500/10 text-teal-400 border-teal-200/20 shadow-lg' },
  ]

const DISTANCES = [
  { label: 'All', value: '' },
  { label: ' 5 km', value: '5' },
  { label: ' 10 km', value: '10' },
  { label: ' 15 km', value: '15' },
  { label: ' 20 km', value: '20' },
  { label: ' 25 km', value: '25' },
]

const FilterBar = ({ activeCategory, activeDistance, onCategoryChange, onDistanceChange }) => {
  return (
    <div className="space-y-4">

      {/* Category Pills */}

      <div className="px-6 py-4 flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onCategoryChange(cat.label)}
              to={`/destinations?category=${cat.label}`}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cat.color} backdrop-blur-sm ${
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

      {/* Distance Filter */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-white/40 text-xs uppercase tracking-widest font-bold mr-1 hidden md:block lg:block">
          Distance:
        </span>
        {DISTANCES.map((dist) => (
          <button
            key={dist.label}
            onClick={() => onDistanceChange(dist.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeDistance === dist.value
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {dist.value && <FaLessThanEqual className="inline-block mr-1" />}
            {dist.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar