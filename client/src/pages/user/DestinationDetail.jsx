import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import Body from '../../components/user/Body'
import LoadingSpinner from '../../components/user/LoadingSpinner'
import api from '../../utils/api'
import ShareButton from '../../components/user/destinationDetails/ShareButton'
import Description from '../../components/user/destinationDetails/Description'
import TravelTips from '../../components/user/destinationDetails/TravelTips'
import Map from '../../components/user/destinationDetails/Map'
import Information from '../../components/user/destinationDetails/Information'
import ImageCarousal from '../../components/user/destinationDetails/ImageCarousal'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Rideegama coordinates (center reference)
const RIDEEGAMA = { lat: 7.5372, lng: 80.2936 }

const CATEGORY_COLORS = {
  Nature:       'bg-green-500/20 text-green-400 border-green-400/30',
  Heritage:     'bg-amber-500/20 text-amber-400 border-amber-400/30',
  Religious:    'bg-purple-500/20 text-purple-400 border-purple-400/30',
  Cultural:     'bg-red-500/20 text-red-400 border-red-400/30',
  Recreational: 'bg-teal-500/20 text-teal-400 border-teal-400/30',
}

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await api.get(`/destinations/${id}`);
        setDestination(res.data.data);
      } catch (err) {
        setError('Destination not found! ' + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchDestination();
  }, [id]);

  // Keyboard navigation for lightbox
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev =>
      prev === destination.images.length - 1 ? 0 : prev + 1
    )
  }, [destination?.images?.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev =>
      prev === 0 ? destination.images.length - 1 : prev - 1
    )
  }, [destination?.images?.length]);

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, nextImage, prevImage]);


  // Share functionality using Web Share API with fallback to clipboard
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: destination.name,
        text: destination.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  // Loading state
  if (loading) {
    return (
      <Body>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner message="Loading destination..." />
        </div>
      </Body>
    );
  }

  // Error state
  if (error || !destination) {
    return (
      <Body>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-6xl mb-4">🏝️</p>
            <h2 className="text-2xl font-black mb-2">Destination Not Found</h2>
            <p className="text-white/60 mb-6">
              This place doesn't exist or has been removed.
            </p>
            <Link
              to="/destinations"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all"
            >
              Browse All Destinations
            </Link>
          </div>
        </div>
      </Body>
    );
  }

  const mainImage = destination.images?.[currentImageIndex]?.url ||
    'https://placehold.co/800x500?text=No+Image'

  return (
    <Body>
      <Navbar />

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 md:left-8 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          <img
            src={destination.images[currentImageIndex]?.url}
            alt={`${destination.name} ${currentImageIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
            onClick={e => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 md:right-8 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <FaChevronRight className="text-xl" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-white text-sm font-bold">
              {currentImageIndex + 1} / {destination.images.length}
            </span>
          </div>

          {/* Close hint */}
          <p className="absolute top-6 right-6 text-white/40 text-xs uppercase tracking-widest">
            {/* Visible on Mobile, hidden on Desktop */}
            <p className="block md:hidden">
              Tap to close
            </p>
            
            {/* Hidden on Mobile, visible on Desktop (medium screens and up) */}
            <p className="hidden md:block">
              ESC to close
            </p>
          </p>

        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Back</span>
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (images + description) */}

          {/* Image Carousal */}
          <div className="lg:col-span-2 space-y-6">
            <ImageCarousal destination={destination} 
                mainImage={mainImage}
                setLightboxOpen={setLightboxOpen}
                currentImageIndex={currentImageIndex}
                nextImage={nextImage}
                prevImage={prevImage}
                CATEGORY_COLORS={CATEGORY_COLORS} 
                setCurrentImageIndex={setCurrentImageIndex}
            />
            

            {/* Name + Share */}
            <ShareButton destination={destination} handleShare={handleShare} />
            

            {/* Description */}
            <Description destination={destination} />
            

            {/* Travel Tips */}
            <TravelTips destination={destination} />
            

            {/* Map */}
            <Map destination={destination} RIDEEGAMA={RIDEEGAMA} />
            
          </div>

          {/* ── Right Column (info cards) ── */}
          <Information destination={destination} />

        </div>
      </div>

      <Footer />
    </Body>
  )
}

export default DestinationDetail