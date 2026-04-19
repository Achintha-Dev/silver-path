import { ImLeaf } from 'react-icons/im'
import { GiAncientRuins } from 'react-icons/gi'
import { FaVihara, FaUsers, FaHiking, FaCircle } from 'react-icons/fa'

const LEGEND_ITEMS = [
  { label: 'Nature',       color: '#22c55e', icon: <ImLeaf /> },
  { label: 'Heritage',     color: '#f59e0b', icon: <GiAncientRuins /> },
  { label: 'Religious',    color: '#a855f7', icon: <FaVihara /> },
  { label: 'Cultural',     color: '#ef4444', icon: <FaUsers /> },
  { label: 'Recreational', color: '#14b8a6', icon: <FaHiking /> },
]

const MapLegend = () => {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-2">

      <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-3">
        Categories
      </p>

      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <FaCircle style={{ color: item.color }} className="text-xs flex-shrink-0" />
          <span className="text-white/70 text-xs font-medium">{item.label}</span>
        </div>
      ))}
      
      <div className="border-t border-white/10 pt-2 mt-2">

        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full border border-dashed border-green-400 flex-shrink-0" />
          <span className="text-white/70 text-xs font-medium">25 km radius</span>
        </div>

        <div className="flex items-center gap-2.5 mt-1.5">
          <FaCircle className="text-xs text-blue-400 flex-shrink-0" />
          <span className="text-white/70 text-xs font-medium">center point</span>
        </div>

      </div>
    </div>
  )
}

export default MapLegend