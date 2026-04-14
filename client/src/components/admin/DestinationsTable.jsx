import { Link } from 'react-router-dom'

import { FaEdit, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'

import api from '../../utils/api'
import LoadingSpinner from '../user/LoadingSpinner'
import ActionButtons from './ActionButtons'


function DestinationsTable() {
    const [destinations, setDestinations] = useState([]);
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

    return (
        <div>
            {loading ? (<LoadingSpinner />) : (<></>)}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest">Destination Info</th>
                                <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest hidden sm:table-cell">Category</th>
                                <th className="px-6 py-5 text-white/30 text-[10px] uppercase font-black tracking-widest hidden lg:table-cell text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {destinations.slice(0, 5).map((dest) => (
                                <tr key={dest._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-2 md:px-6 py-4">
                                        <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 shrink-0">
                                            <img
                                            src={dest.images?.[0]?.url || 'https://placehold.co/48x48'}
                                            alt={dest.name}
                                            className="w-full h-full rounded-xl object-cover border border-white/10"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-bold truncate tracking-tight">{dest.name}</p>
                                            <p className="text-white/30 text-[10px] sm:hidden uppercase font-bold">{dest.category}</p>
                                        </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-black uppercase tracking-widest">
                                        {dest.category}
                                        </span>
                                    </td>
                                    <td className="px-0 md:px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <ActionButtons dest={dest} setDestinations={setDestinations} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DestinationsTable