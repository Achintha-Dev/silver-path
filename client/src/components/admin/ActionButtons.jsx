import React from 'react'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'

function ActionButtons({ dest, setDestinations }) {
    // delete button handler
    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: `Delete "${name}"?`,
            text: 'This will permanently delete the destination and all its images.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            background: '#1a1a2e',
            color: '#fff',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#ffffff20',
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/destinations/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setDestinations(prev => prev.filter(d => d._id !== id));
            toast.success(`"${name}" deleted successfully`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    }

  return (
    <div className="flex items-center justify-end gap-3">
        <Link
            to={`/admin/destinations/edit/${dest._id}`}
            className="w-10 h-10 flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all"
            title="Edit"
        >
            <FaEdit size={16} />
        </Link>
        <button
            onClick={() => handleDelete(dest._id, dest.name)}
            className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
            title="Delete"
        >
            <FaTrash size={16} />
        </button>
    </div>
  )
}

export default ActionButtons