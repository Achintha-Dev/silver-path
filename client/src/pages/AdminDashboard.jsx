import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { HiOutlineSparkles } from 'react-icons/hi'
import { FaEdit } from 'react-icons/fa'
import { FaMapMarkerAlt, FaPlus, FaLeaf, FaLandmark, FaPray, FaUsers, FaHiking, FaWalking, FaTrash } from 'react-icons/fa'

import AdminLayout from '../components/admin/AdminLayout'
import api from '../utils/api'
import DestinationsTable from '../components/admin/DestinationsTable'

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <span className="text-xl">{icon}</span>
    </div>
    <div>
      <p className="text-white/50 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-white text-3xl font-black">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations')
        setDestinations(res.data.data)
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, []);

  

  // Category counts
  const categoryCounts = {
    Nature:       destinations.filter(d => d.category === 'Nature').length,
    Heritage:     destinations.filter(d => d.category === 'Heritage').length,
    Religious:    destinations.filter(d => d.category === 'Religious').length,
    Cultural:     destinations.filter(d => d.category === 'Cultural').length,
    Recreational: destinations.filter(d => d.category === 'Recreational').length,
  }

  const categoryStats = [
    { label: 'Nature',       value: categoryCounts.Nature,       icon: <FaLeaf />,     color: 'bg-green-500/20 text-green-400' },
    { label: 'Heritage',     value: categoryCounts.Heritage,     icon: <FaLandmark />, color: 'bg-amber-500/20 text-amber-400' },
    { label: 'Religious',    value: categoryCounts.Religious,    icon: <FaPray />,     color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Cultural',     value: categoryCounts.Cultural,     icon: <FaUsers />,    color: 'bg-red-500/20 text-red-400' },
    { label: 'Recreational', value: categoryCounts.Recreational, icon: <FaHiking />,   color: 'bg-teal-500/20 text-teal-400' },
  ]

  return (
    <AdminLayout>
  <div className="space-y-8 pb-10">
    
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter font-['Montserrat'] leading-none">
          Dashboard
        </h2>
        <p className="text-white/40 text-sm mt-2 font-medium">
          Global overview of <span className="text-white/70">Silver Path</span> operations.
        </p>
      </div>
      <div className="hidden md:block">
         <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
            Last Updated: {new Date().toLocaleTimeString()}
         </span>
      </div>
    </div>

    {/* Primary Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Destinations"
        value={loading ? '...' : destinations.length}
        icon={<FaMapMarkerAlt />}
        color="bg-blue-500/10 border-blue-500/20 text-blue-400"
      />
      <StatCard
        label="Within 10 km"
        value={loading ? '...' : destinations.filter(d => d.distanceFromRideegama <= 10).length}
        icon={<FaWalking />}
        color="bg-green-500/10 border-green-500/20 text-green-400"
      />
      {/* Example of adding more logic-based stats */}
      <StatCard
        label="Categories"
        value={categoryStats.length}
        icon={<HiOutlineSparkles />}
        color="bg-purple-500/10 border-purple-500/20 text-purple-400"
      />
      <StatCard
        label="System Status"
        value="Active"
        icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
        color="bg-white/5 border-white/10 text-white/70"
      />
    </div>

    {/* Content Layout: Quick Actions & Category Breakdown */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Side: Category Breakdown */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-black">
            Destination Categories
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryStats.map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all">
               <div className={`${stat.color.split(' ')[1]} mb-2`}>{stat.icon}</div>
               <p className="text-white/40 text-[10px] uppercase font-bold truncate">{stat.label}</p>
               <p className="text-white text-xl font-black">{loading ? '...' : stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-black">
          Operations
        </h3>
        <div className="flex flex-col gap-3">
          <Link
            to="/admin/destinations/add"
            className="group relative overflow-hidden bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4 transition-all"
          >
            <div className="w-10 h-10 bg-green-500 text-black rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <FaPlus />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Add New</p>
              <p className="text-green-500/60 text-[10px] font-medium uppercase tracking-wider">Expand Network</p>
            </div>
          </Link>

          <Link
            to="/admin/destinations"
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex items-center gap-4 transition-all"
          >
            <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Inventory</p>
              <p className="text-white/30 text-[10px] font-medium uppercase tracking-wider">Edit & Manage</p>
            </div>
          </Link>
        </div>
      </div>
    </div>

    {/* Bottom Section: Recent Activity Table */}
    <DestinationsTable />
    
  </div>
</AdminLayout>
  )
}

export default AdminDashboard