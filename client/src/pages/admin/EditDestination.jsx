import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUpload, FaTimes, FaMapMarkerAlt, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../utils/api'
import GlassySelect from '../../components/admin/GlassySelect'

const CATEGORIES = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Recreational']

const EditDestination = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existingImages, setExistingImages] = useState([]) // from DB
  const [newImages, setNewImages] = useState([])           // newly selected files
  const [newPreviews, setNewPreviews] = useState([])       // previews for new files
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', address: '',
    lat: '', lng: '', openingHours: '', entryFee: 'Free',
    facilities: '', travelTips: '', distanceFromRideegama: ''
  })

  // Fetch existing destination data
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await api.get(`/destinations/${id}`)
        const dest = res.data.data

        setFormData({
          name: dest.name || '',
          category: dest.category || '',
          description: dest.description || '',
          address: dest.address || '',
          lat: dest.location?.lat || '',
          lng: dest.location?.lng || '',
          openingHours: dest.openingHours || '',
          entryFee: dest.entryFee || 'Free',
          facilities: dest.facilities || '',
          travelTips: dest.travelTips || '',
          distanceFromRideegama: dest.distanceFromRideegama || ''
        })

        setExistingImages(dest.images || [])

      } catch (error) {
        toast.error('Failed to load destination: ' + (error.response?.data?.message || error.message))
        navigate('/admin/destinations')
      } finally {
        setLoading(false)
      }
    }
    fetchDestination()
  }, [id, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const totalImages = existingImages.length + newImages.length + files.length

    if (totalImages > 20) {
      toast.error('Maximum 20 images allowed per destination')
      return
    }

    setNewImages(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove a newly selected image (not yet uploaded)
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Delete an existing image from Cloudinary + DB
  const handleDeleteExistingImage = async (publicId, index) => {
    const totalAfterDelete = existingImages.length + newImages.length - 1

    if (totalAfterDelete < 5) {
      toast.error('Cannot delete — minimum 5 images required')
      return
    }

    const result = await Swal.fire({
      title: 'Delete this image?',
      text: 'This will permanently remove it from Cloudinary.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#1a1a2e',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#ffffff20',
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(
        `/destinations/${id}/images/${encodeURIComponent(publicId)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      )
      setExistingImages(prev => prev.filter((_, i) => i !== index))
      toast.success('Image deleted successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete image')
    }
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    const totalImages = existingImages.length + newImages.length
    if (totalImages < 5) {
      toast.error('Minimum 5 images required')
      return
    }

    setSaving(true)

    try {
      const data = new FormData()

      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })

      // Append new image files if any
      newImages.forEach(img => data.append('images', img))

      await api.put(`/destinations/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Destination updated successfully!')
      navigate('/admin/destinations')

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update destination')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/40 focus:bg-white/15 transition-all"
  const labelClass = "text-white/60 text-xs uppercase tracking-widest mb-2 block"

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tight font-['Montserrat']">
            Edit Destination
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Updating: <span className="text-white/70 font-medium">{formData.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  name="name"
                  type="text"
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <GlassySelect
                  options={CATEGORIES}
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="Select category"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                rows={4}
                className={inputClass}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Address *</label>
              <input
                name="address"
                type="text"
                className={inputClass}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-3">
              Location & Distance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Latitude *</label>
                <input
                  name="lat"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.lat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Longitude *</label>
                <input
                  name="lng"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.lng}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Distance from Rideegama (km) *</label>
                <input
                  name="distanceFromRideegama"
                  type="number"
                  step="any"
                  className={inputClass}
                  value={formData.distanceFromRideegama}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <p className="text-white/30 text-xs flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-400" />
              Get coordinates from Google Maps — right click on location → copy lat/lng
            </p>
          </div>

          {/* Visit Info */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-3">
              Visit Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Opening Hours *</label>
                <input
                  name="openingHours"
                  type="text"
                  className={inputClass}
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Entry Fee</label>
                <input
                  name="entryFee"
                  type="text"
                  className={inputClass}
                  value={formData.entryFee}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Facilities</label>
              <input
                name="facilities"
                type="text"
                className={inputClass}
                value={formData.facilities}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className={labelClass}>Travel Tips</label>
              <textarea
                name="travelTips"
                rows={3}
                className={inputClass}
                value={formData.travelTips}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image Management */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-3">
              Images
              <span className="text-white/40 font-normal ml-2 normal-case text-xs">
                ({existingImages.length + newImages.length} total — minimum 5)
              </span>
            </h3>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className={labelClass}>Current Images</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {existingImages.map((img, i) => (
                    <div key={img.public_id} className="relative group">
                      <img
                        src={img.url}
                        alt={`Image ${i + 1}`}
                        className="w-full h-24 object-cover rounded-xl border border-white/10"
                      />
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.public_id, i)}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Delete image"
                      >
                        <FaTrash className="text-white text-[10px]" />
                      </button>
                      {/* Image number */}
                      <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1.5 py-0.5">
                        <span className="text-white text-[9px] font-bold">{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {newPreviews.length > 0 && (
              <div>
                <p className={labelClass}>New Images (not saved yet)</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {newPreviews.map((preview, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${i + 1}`}
                        className="w-full h-24 object-cover rounded-xl border border-blue-400/30"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="text-white text-[10px]" />
                      </button>
                      {/* New badge */}
                      <div className="absolute bottom-1 left-1 bg-blue-500/80 rounded px-1.5 py-0.5">
                        <span className="text-white text-[9px] font-bold">NEW</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-6 cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
              <FaUpload className="text-white/30 text-2xl mb-2" />
              <p className="text-white/60 text-sm font-medium">
                Add more images
              </p>
              <p className="text-white/30 text-xs mt-1">
                JPG, PNG, JPEG up to 5MB each
              </p>
              <input
                type="file"
                multiple
                accept="image/jpg,image/png,image/jpeg"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* Image count warning */}
            {existingImages.length + newImages.length < 5 && (
              <p className="text-amber-400 text-xs flex items-center gap-2">
                ⚠️ Need {5 - (existingImages.length + newImages.length)} more image(s) to meet minimum requirement
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving changes...
                </span>
              ) : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/destinations')}
              className="md:px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default EditDestination