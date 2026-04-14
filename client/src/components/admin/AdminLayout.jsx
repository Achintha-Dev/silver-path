import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaGripfire, FaTachometerAlt, FaMapMarkerAlt,
         FaPlus, FaBars, FaTimes, FaSignOutAlt, FaArrowAltCircleRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import videoBg from '../../assets/bg.mp4'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false) // separate state for desktop
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/destinations', label: 'Destinations', icon: <FaMapMarkerAlt /> },
    { to: '/admin/destinations/add', label: 'Add Destination', icon: <FaPlus /> },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}')

  // Toggle correctly based on screen
  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(prev => !prev)  // mobile: show/hide overlay
    } else {
      setDesktopCollapsed(prev => !prev)  // desktop: collapse/expand
    }
  }

  return (
    <div className="h-screen flex overflow-hidden relative font-sans">

      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <video
          src={videoBg}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: sidebarOpen
            ? '256px'
            : window.innerWidth >= 768
              ? desktopCollapsed ? '72px' : '256px'
              : '0px'
        }}
        className={`
          fixed md:relative top-0 left-0 h-full z-30
          flex flex-col flex-shrink-0
          bg-white/10 backdrop-blur-xl
          border-r border-white/10
          transition-all duration-300 ease-in-out
          overflow-hidden
          ${!sidebarOpen && 'max-md:-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-[64px] overflow-hidden">
          <FaGripfire className="text-blue-400 text-2xl flex-shrink-0" />
          <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
            (sidebarOpen || !desktopCollapsed) ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
          }`}>
            <p className="text-white font-black font-['Montserrat'] tracking-widest text-sm">
              SILVER PATH
            </p>
            <p className="text-white/40 text-[9px] uppercase tracking-widest">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              title={desktopCollapsed ? link.label : ''}  // tooltip when collapsed
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-white/20 text-white border border-white/20'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 overflow-hidden ${
                (sidebarOpen || !desktopCollapsed) ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Admin Info + Logout */}
        <div className="px-2 py-4 border-t border-white/10 overflow-hidden">
          <div className={`px-3 py-2 mb-2 transition-all duration-300 overflow-hidden whitespace-nowrap ${
            (sidebarOpen || !desktopCollapsed) ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0'
          }`}>
            <p className="text-white text-xs font-bold truncate">{adminInfo.name}</p>
            <p className="text-white/40 text-[10px] truncate">{adminInfo.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 overflow-hidden ${
              (sidebarOpen || !desktopCollapsed) ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Bar */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center gap-4 z-10 min-h-[64px]">
          <button
            onClick={handleToggle}  // uses smart toggle
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          >
            {(sidebarOpen || (!desktopCollapsed && window.innerWidth >= 768))
              ? <FaTimes className="text-xl" />
              : <FaBars className="text-xl" />
            }
          </button>

          <h1 className="text-white font-black uppercase tracking-wider text-sm truncate">
            {navLinks.find(l => isActive(l.to))?.label || 'Admin'}
          </h1>
          
          {/* move to Home page */}
          <div className="ml-auto flex-shrink-0 flex">
            <Link
              to="/"
              target="_blank"
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors whitespace-nowrap bg-white/10 p-1 rounded hover:translate-x-1"
              title="Go to Home page"
            >
              View Site <FaArrowAltCircleRight className='inline-block mb-1'/>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout