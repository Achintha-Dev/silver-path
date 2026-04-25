import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUpload, FaTimes, FaMapMarkerAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../utils/api'
import GlassySelect from '../../components/admin/GlassySelect'

const CATEGORIES = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Recreational']

const AddDestination = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', address: '',
    lat: '', lng: '', openingHours: '', entryFee: 'Free',
    facilities: '', travelTips: '', distanceFromRideegama: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 20) {
      toast.error('Maximum 20 images allowed');
      return
    }

    setImages(prev => [...prev, ...files]);

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result]);
      }
      reader.readAsDataURL(file);
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 1) {
      toast.error('Please upload at least 1 image');
      return
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })
      images.forEach(img => data.append('images', img));

      await api.post('/destinations', data );

      toast.success('Destination created successfully!');
      navigate('/admin/destinations');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create destination');
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/40 focus:bg-white/15 transition-all"
  const labelClass = "text-white/60 text-xs uppercase tracking-widest mb-2 block"

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tight font-['Montserrat']">
            Add Destination
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Create a new place of interest
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
                <label htmlFor="name" className={labelClass}>Name *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Ridi Viharaya"
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
              <label htmlFor="description" className={labelClass}>Description *</label>
              <textarea
                name="description"
                placeholder="Describe this destination..."
                rows={4}
                className={inputClass}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>Address *</label>
              <input
                name="address"
                type="text"
                placeholder="e.g. Rideegama, Kurunegala"
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
                <label htmlFor="lat" className={labelClass}>Latitude *</label>
                <input
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="e.g. 7.52"
                  className={inputClass}
                  value={formData.lat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lng" className={labelClass}>Longitude *</label>
                <input
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="e.g. 80.52"
                  className={inputClass}
                  value={formData.lng}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="distanceFromRideegama" className={labelClass}>Distance from Rideegama (km) *</label>
                <input
                  name="distanceFromRideegama"
                  type="number"
                  step="any"
                  placeholder="e.g. 9"
                  className={inputClass}
                  value={formData.distanceFromRideegama}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Google Maps tip */}
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
                <label htmlFor="openingHours" className={labelClass}>Opening Hours *</label>
                <input
                  name="openingHours"
                  type="text"
                  placeholder="e.g. 6:00 AM - 6:00 PM"
                  className={inputClass}
                  value={formData.openingHours}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="entryFee" className={labelClass}>Entry Fee</label>
                <input
                  name="entryFee"
                  type="text"
                  placeholder="e.g. Free or LKR 500"
                  className={inputClass}
                  value={formData.entryFee}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="facilities" className={labelClass}>Facilities</label>
              <textarea
                name="facilities"
                type="textarea"
                placeholder="e.g. Parking, Restrooms, Food Stalls"
                rows={10}
                className={inputClass}
                value={formData.facilities}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="travelTips" className={labelClass}>Travel Tips</label>
              <textarea
                name="travelTips"
                placeholder="Any useful tips for visitors..."
                rows={10}
                className={inputClass}
                value={formData.travelTips}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-3">
              Images
              <span className="text-white/40 font-normal ml-2 normal-case text-xs">
                (minimum 5 required, max 20)
              </span>
            </h3>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-8 cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
              <FaUpload className="text-white/30 text-3xl mb-3" />
              <p className="text-white/60 text-sm font-medium">
                Click to upload images
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

            {/* Image count indicator */}
            {images.length > 0 && (
              <div className="flex items-center gap-2">
                <div className={`text-xs font-bold ${images.length >= 5 ? 'text-green-400' : 'text-amber-400'}`}>
                  {images.length} image{images.length !== 1 ? 's' : ''} selected ✓
                </div>
              </div>
            )}

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {previews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-24 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes className="text-white text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : 'Create Destination'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/destinations')}
              className="px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white font-bold uppercase tracking-wider rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AddDestination