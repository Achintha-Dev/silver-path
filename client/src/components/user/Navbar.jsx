import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaGripfire  } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/planner', label: 'Plan Your Visit' },
    { to: '/map', label: 'Map' },
  ]

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleScroll = (e) => {
      setIsScrolled(e.detail.scrollTop > 50)  // uses Body's scroll position
    }
    window.addEventListener('bodyScroll', handleScroll)
    return () => window.removeEventListener('bodyScroll', handleScroll)
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500  ${
      isScrolled
        ? 'py-2 bg-white/30 backdrop-blur-sm border-b border-white/20 shadow-xl'
        : 'py-4 bg-white/10'
    }`}>
      <div className="max-w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-10">

          {/* Brand - Montserrat added for the "Silver Path" look */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-1 group">
              <FaGripfire className={`text-4xl transition-all duration-300 ${
                isScrolled ? 'text-blue-400 drop-shadow-glow' : 'text-white'
              }`} />
              
              <div className="flex flex-col">
                <span className={`text-xl font-black tracking-[0.2em] font-['Montserrat'] transition-all duration-300 ${
                  isScrolled 
                    ? 'text-white drop-shadow-md ' 
                    : 'bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent'
                }`}>
                  SILVER PATH
                </span>
                <span className={`text-[10px] uppercase tracking-widest font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-white/70' : 'text-white/80'
                }`}>
                  Local Day-Visit Planner
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-bold transition-all duration-300 uppercase tracking-widest ${
                  isScrolled
                    ? isActive(link.to)
                      ? 'text-blue-300 border-b-2 border-blue-300/50 pb-1'
                      : 'text-white/80 hover:text-white'
                    : isActive(link.to)
                      ? 'text-white border-b-2 border-white pb-1'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
              isScrolled
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className={`md:hidden mt-2 rounded-2xl border transition-all duration-300 overflow-hidden ${
            isScrolled
              ? 'bg-black/40 backdrop-blur-xl border-white/10'
              : 'bg-white/10 backdrop-blur-md border-white/20 shadow-2xl'
          }`}>
            <div className="px-4 py-6 space-y-2">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                    isActive(link.to)
                      ? 'bg-white/20 text-white border-l-4 border-blue-400'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar