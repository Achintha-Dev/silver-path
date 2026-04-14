import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaCheck } from 'react-icons/fa'

export default function GlassySelect({ value, onChange, options, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.find(o => o === value);

  return (
     <div ref={ref} className="relative">

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-all
          bg-white/10 border-white/20 backdrop-blur-xl
          hover:bg-white/15 hover:border-white/30
          focus:outline-none focus:border-white/40
          ${value ? 'text-white' : 'text-white/30'}
        `}
      >
        <span>{selected || placeholder}</span>
        <FaChevronDown className={`text-white/40 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50
          bg-black/40 backdrop-blur-2xl
          border border-white/20
          rounded-2xl overflow-hidden
          shadow-2xl shadow-black/50
        ">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-all
                hover:bg-white/10
                ${value === option
                  ? 'text-white bg-white/10 font-bold'
                  : 'text-white/70'
                }
              `}
            >
              <span className="uppercase tracking-wider text-xs">{option}</span>
              {value === option && (
                <FaCheck className="text-green-400 text-xs" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
