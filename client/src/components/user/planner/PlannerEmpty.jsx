import { FaCalendarAlt } from "react-icons/fa" 

const PlannerEmpty = () => {
  return (
    <div className="min-h-[400px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
      <div className="text-6xl mb-4"><FaCalendarAlt className="text-white/10"/></div>
      <h3 className="text-white font-black text-xl uppercase tracking-tight mb-2">
        Your <span className="text-green-500">itinerary</span> will appear here
      </h3>
      <p className="text-white/40 text-sm max-w-sm">
        Select at least 2 destinations from the list
        and click Generate Day Plan
      </p>
    </div>
  )
}

export default PlannerEmpty