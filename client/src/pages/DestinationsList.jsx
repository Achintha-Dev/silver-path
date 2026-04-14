import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkerAlt } from 'react-icons/fa'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import AdminLayout from '../components/admin/AdminLayout'
import api from '../utils/api'
import ActionButtons from '../components/admin/ActionButtons'

const DestinationsList = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDestinations = async () => {
    try {
      const res = await api.get('/destinations');
      setDestinations(res.data.data);
    } catch (error) {
      toast.error('Failed to load destinations: ', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  const CATEGORY_COLORS = {
    Nature:       'bg-green-500/20 text-green-400',
    Heritage:     'bg-amber-500/20 text-amber-400',
    Religious:    'bg-purple-500/20 text-purple-400',
    Cultural:     'bg-red-500/20 text-red-400',
    Recreational: 'bg-teal-500/20 text-teal-400',
  }

  return (
    <AdminLayout>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h2 className="text-white font-black text-3xl uppercase tracking-tight font-['Montserrat']">
                Destinations
                </h2>
                <p className="text-white/40 text-sm mt-1">
                {destinations.length} managed locations in Rideegama
                </p>
            </div>
            
            {/* Desktop Link */}
            <Link
                to="/admin/destinations/add"
                className="hidden md:flex items-center gap-2 bg-green-400/20 hover:bg-green-400/30 backdrop-blur-lg border border-green-500/40 text-green-400 font-bold uppercase tracking-wider px-6 py-3 rounded-xl text-xs transition-all hover:scale-105"
            >
                <FaPlus size={18}/> Add New Destination
            </Link>
            </div>

            {/* Search with improved focus state */}
            <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
            <input
                type="text"
                placeholder="Filter by name, category or address..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm placeholder:text-white/20 outline-none focus:border-green-500/50 transition-all backdrop-blur-xl shadow-inner"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>

            {/* Table / List Container */}
            
            <div className="min-h-[400px]">
            {loading ? (
                <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-white/5 border-t-green-500 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-white/40 text-sm italic">
                    {search ? `No results for "${search}"` : 'Your destination list is empty.'}
                </p>
                </div>
            ) : (
                <>
                {/* MOBILE LIST VIEW (Visible only on small screens) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filtered.map((dest) => (
                    <div key={dest._id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-4 space-y-4">
                        <div className="flex gap-4">
                        <img
                            src={dest.images?.[0]?.url || 'https://placehold.co/100x100'}
                            alt={dest.name}
                            className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${CATEGORY_COLORS[dest.category]}`}>
                            {dest.category}
                            </span>
                            <h3 className="text-white font-bold text-lg truncate mt-1">{dest.name}</h3>
                            <p className="text-white/40 text-[10px] truncate">{dest.address}</p>
                        </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="text-white/60 text-[10px] font-medium uppercase tracking-widest">
                                {dest.distanceFromRideegama} km away
                            </div>
                            <div className="flex gap-2">
                                <ActionButtons dest={dest} setDestinations={setDestinations} />
                            </div>
                        </div>
                    </div>
                    ))}
                </div>

                {/* DESKTOP TABLE VIEW (Hidden on small screens) */}
                <div className="hidden md:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <table className='w-full text-left border-collapse'>
                        <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest">#</th>
                            <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest">Information</th>
                            <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest text-center">Category</th>
                            <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest">Stats</th>
                            <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filtered.map((dest, i) => (
                            <tr key={dest._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 text-white/20 text-xs font-mono">{i + 1}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                    <img
                                        src={dest.images?.[0]?.url || 'https://placehold.co/48x48'}
                                        alt={dest.name}
                                        className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-white/30 transition-all"
                                    />
                                    <div>
                                        <p className="text-white text-base font-bold tracking-tight">{dest.name}</p>
                                        <p className="text-white/40 text-[10px] font-medium max-w-[250px] truncate italic">
                                            {dest.address}
                                        </p>
                                    </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${CATEGORY_COLORS[dest.category]}`}>
                                    {dest.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-bold">
                                            <FaMapMarkerAlt size={10} className="text-green-500" /> {dest.distanceFromRideegama} KM
                                        </div>
                                        <div className="text-white/30 text-[9px] uppercase tracking-tighter">
                                            {dest.images?.length || 0} Photos uploaded
                                        </div>
                                    </div>
                                </td>
                                {/* Action Buttons (edit/delete)*/}
                                <td className="px-6 py-4">
                                    <ActionButtons dest={dest} setDestinations={setDestinations} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}
            </div>

            {/* MOBILE FLOATING ACTION BUTTON */}
            <Link
                to="/admin/destinations/add"
                className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-green-500/10 flex items-center justify-center text-white rounded-full shadow-2xl z-50 active:scale-90 transition-transform border-4 border-white/10"
            >
                <FaPlus size={24} />
            </Link>
        </div>
    </AdminLayout>
  )
}

export default DestinationsList