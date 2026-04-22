import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function Hero({onSearch}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await api.get('/destinations');
        setDestinations(data.data);
      } catch (err) {
        console.error('Search fetch error', err);
      }
    }
    fetchAll()
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 1) {
      const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]); // clear suggestions
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]); // clear suggestions not setShowSuggestions
    if (onSearch) onSearch(searchQuery);
  }

  const handleSuggestionClick = (dest) => {
    setSuggestions([]); // clear suggestions
    setSearchQuery(dest.name);
    navigate(`/destinations/${dest._id}`);
  }

  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 200);  // clear suggestions
  }

  return (
    <section className="relative min-h-[580px] overflow-hidden">
      <div className="relative z-20 flex min-h-[580px] items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center text-white">
          <p className="text-gray-300 text-xs font-medium tracking-[4px] uppercase mb-4 mt-4">
            Rideegama · Kurunegala · Sri Lanka
          </p>

          <h1 className="font-['Montserrat'] text-3xl font-black bg-gradient-to-br from-white/80 via-white/20 to-white/70 bg-clip-text text-transparent uppercase md:text-6xl mb-4">
           <span className='font-heading font-black tracking-[0.3em] text-white/10 mb-2 md:text-6xl text-4xl'>Welcome</span> <br /> <span className="font-serif text-white/50 text-2xl md:text-5xl uppercase tracking-tight"> Your Local Day-Trip Guide </span>
          </h1>

          <div className="relative max-w-2xl mx-auto mb-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:flex-row md:items-center md:p-1 shadow-2xl"
            >
              <input
                id='text'
                type="text"
                placeholder="Search temples, nature spots..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 outline-none"
                value={searchQuery}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              <button
                type="submit"
                className="rounded-xl btn bg-white/10 backdrop-blur-lg px-8 py-3 text-sm font-bold border-white/40 text-white transition-all hover:bg-white/30"
              >
                EXPLORE
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl text-left">
                {suggestions.map((dest) => (
                  <div
                    key={dest._id}
                    onClick={() => navigate(`/destinations/${dest._id}`)}
                    onMouseDown={() => handleSuggestionClick(dest)}
                    className="px-5 py-3 border-b border-white/5 hover:bg-white/10 cursor-pointer flex justify-between items-center group transition-all"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">{dest.name}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest">{dest.category}</div>
                    </div>
                    <span className="text-white/20 group-hover:text-white/80 transition-all">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats section (keeping your original design) */}
          <div className="flex flex-row gap-4 justify-center sm:gap-10">
            {[{ num: '10+', label: 'Destinations' }, { num: '25km', label: 'Radius' }, { num: '5', label: 'Categories' }].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-300">{stat.num}</div>
                <div className="text-xs text-white/60 tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;