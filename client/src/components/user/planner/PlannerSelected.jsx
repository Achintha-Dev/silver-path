import { FaTimes, FaMagic, FaMapMarkedAlt } from 'react-icons/fa'

const PlannerSelected = ({ selected, onRemove, onClear, onGenerate, generating }) => {
  const minRequired = 2
  const maxAllowed = 8
  const canGenerate = selected.length >= minRequired

  return (
    <div className="space-y-3">

      {/* Selected list */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <h3 className="text-white font-black uppercase tracking-wider text-[10px] sm:text-xs">
            Your Plan
            <span className="text-white/30 font-normal ml-1">
              ({selected.length}/{maxAllowed})
            </span>
          </h3>
          {selected.length > 0 && (
            <button
              onClick={onClear}
              className="text-white/30 hover:text-red-400 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold transition-colors bg-white/10 rounded p-1"
              title='clear your plan'
            >
              Clear all
            </button>
          )}
        </div>

        <div className="max-h-[300px] sm:max-h-none overflow-y-auto custom-scrollbar">
          {selected.length === 0 ? (
            <div className="text-center py-6 sm:py-8 flex flex-col items-center justify-center">
              <div className="text-3xl sm:text-4xl mb-2 opacity-10">
                <FaMapMarkedAlt className="text-white" />
              </div>
              <p className="text-white/30 text-[10px] sm:text-xs uppercase tracking-widest">
                No destinations selected
              </p>
              <p className="text-white/20 text-[9px] mt-1">
                Add at least {minRequired} to generate
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {selected.map((dest, i) => (
                <div key={dest._id} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5">
                  <span className="text-white/20 text-[10px] sm:text-xs font-bold w-4 flex-shrink-0 text-center">
                    {i + 1}
                  </span>
                  <img
                    src={dest.images?.[0]?.url || 'https://placehold.co/32x32'}
                    alt={dest.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <p className="text-white text-[11px] sm:text-xs font-bold flex-1 truncate">
                    {dest.name}
                  </p>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemove(dest._id)}
                    className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 p-1.5 bg-white/10 rounded-lg hover:bg-white/20"
                    title='remove from list'
                  >
                    <FaTimes className="text-[10px] sm:text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate || generating}
        className="
          /* Base Mobile Styles */
          w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 
          bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-widest 
          py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl transition-all active:scale-95 sm:hover:scale-[1.01] 
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-[11px] sm:text-sm
        "
      >
        {generating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2" title='create your plan'>
              <FaMagic className="text-sm sm:text-base" />
              <span>Generate Day Plan</span>
            </div>
            
            {!canGenerate && (
              <span className="text-white/50 font-medium normal-case text-[10px] sm:text-xs">
                (need {minRequired - selected.length} more)
              </span>
            )}
          </>
        )}
      </button>
    </div>
  )
}

export default PlannerSelected