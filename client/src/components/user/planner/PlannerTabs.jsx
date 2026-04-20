import { FaList, FaMapMarkedAlt, FaCar } from 'react-icons/fa'

const TABS = [
  { id: 'itinerary', label: 'Itinerary', icon: <FaList /> },
  { id: 'map',       label: 'Map',       icon: <FaMapMarkedAlt /> },
  { id: 'route',     label: 'Route',     icon: <FaCar /> },
]

const PlannerTabs = ({ activeTab, onChange }) => {
  return (
    <div className="flex gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === tab.id
              ? 'bg-white/20 text-white'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default PlannerTabs