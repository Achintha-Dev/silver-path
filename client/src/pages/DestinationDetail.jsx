import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Icons
import { FaClock, FaTicketAlt, FaMapMarkerAlt, FaWalking, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

import Navbar from '../components/user/Navbar';
import Body from '../components/user/Body';
import MoreDestinations from '../components/user/MoreDestinations';
import Footer from '../components/user/Footer';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDestination = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/destinations/${id}`);
            setDestination(data.data);
            setLoading(false);
            window.scrollTo(0, 0); // Scroll to top on load
        } catch (error) {
            console.error("Error fetching destination", error);
            setLoading(false);
        }
    };
        fetchDestination();
    }, [id]);

    const nextImage = () => {
        if (!destination?.images?.length) return;
        setActiveImage((prev) => (prev + 1) % destination.images.length);
    };

    const prevImage = () => {
        if (!destination?.images?.length) return;
        setActiveImage((prev) => (prev - 1 + destination.images.length) % destination.images.length);
    };

  // map direction handler
  const handleOpenMap = () => {
  const destLat = destination.location.lat;
  const destLng = destination.location.lng;
  const rideegamaCoords = "Rideegama"; // Coordinates for Rideegama Town

  const openDirections = (startCoords) => {
    // Google Maps direction format: /dir/Origin/Destination
    const url = `https://www.google.com/maps/dir/${startCoords}/${destLat},${destLng}`;
    window.open(url, '_blank');
  };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: User gave permission
          const userCoords = `${position.coords.latitude},${position.coords.longitude}`;
          openDirections(userCoords);
        },
        () => {
          // Error/Denied: Fallback to Rideegama
          console.warn("Location access denied or failed. Falling back to Rideegama.");
          openDirections(rideegamaCoords);
        }
      );
    } else {
      // Browser doesn't support Geolocation: Fallback to Rideegama
      openDirections(rideegamaCoords);
    }
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!destination) return <div className="min-h-screen flex items-center justify-center text-white">Destination not found.</div>;

  // Real Google Maps URL using backend coordinates
  const mapUrl = `https://www.google.com/maps?q=${destination.location.lat},${destination.location.lng}&output=embed`;

  return (
    <Body>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-20 pt-24 md:pt-32">
        
        {/* ── HERO SECTION ── */}
        <div className="relative mb-5 group overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl h-[40vh] sm:h-[50vh] md:h-[70vh]">
          {/* Main Image */}
          <img 
            src={destination.images[activeImage]?.url} 
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlays - Pointer events none so it doesn't block clicks */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral/90 via-neutral/20 to-transparent pointer-events-none" />
          
          {/* Controls - Added higher z-index (z-20) and relative positioning */}
          {destination.images.length > 1 && (
          <div className="absolute top-[93%] md:top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-24 md:px-6 z-30 pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }} 
              className="pointer-events-auto btn btn-circle btn-sm md:btn-md bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
            >
              <FaChevronLeft className="text-[10px] md:text-base"/>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }} 
              className="pointer-events-auto btn btn-circle btn-sm md:btn-md bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
            >
              <FaChevronRight className="text-[10px] md:text-base"/>
            </button>
          </div>
        )}

          {/* Floating Title Card - Lower z-index (z-10) than buttons */}
          <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-auto max-w-2xl z-10 pointer-events-none">
            <span className="px-4 py-1.5 rounded-full bg-green-500/20 backdrop-blur-xl border border-green-500/30 text-green-400 text-xs font-black tracking-widest uppercase mb-4 inline-block pointer-events-auto">
              {destination.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4 break-words pointer-events-auto drop-shadow-lg">
              {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-white/70 pointer-events-auto">
              <FaMapMarkerAlt className="text-green-500"/>
              <p className="text-sm md:text-base font-medium">{destination.address}</p>
            </div>
          </div>
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <FaClock className="text-green-500 mb-3 text-xl"/>
                  <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Opening Hours</p>
                  <p className="text-white font-medium">{destination.openingHours}</p>
               </div>
               <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <FaTicketAlt className="text-green-500 mb-3 text-xl"/>
                  <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Entry Fee</p>
                  <p className="text-white font-medium">{destination.entryFee}</p>
               </div>
               <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm col-span-2 md:col-span-1">
                  <FaWalking className="text-green-500 mb-3 text-xl"/>
                  <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Distance from Ridigama town</p>
                  <p className="text-white font-medium">{destination.distanceFromRideegama} KM</p>
               </div>
            </div>

            {/* About */}
            <div className="bg-white/10 p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                <HiOutlineSparkles className="text-green-500"/> The Experience
              </h3>
              <p className="text-white/70 leading-relaxed text-lg italic">
                "{destination.description}"
              </p>
            </div>

            {/* Travel Tips & Facilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                <h4 className="text-green-500 font-black uppercase tracking-widest text-xs mb-3">Available Facilities</h4>
                <p className="text-white/80">{destination.facilities || 'Basic amenities available nearby.'}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                <h4 className="text-green-500 font-black uppercase tracking-widest text-xs mb-3">Pro Travel Tips</h4>
                <p className="text-white/80">{destination.travelTips || 'Recommended to bring a camera and water.'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar / Map */}
          <div className="space-y-6">
            <div className="bg-white/10 p-4 pb-14 rounded-[2rem] border border-white/10 h-80 lg:h-[450px] overflow-hidden lg:sticky lg:top-32 top-32 shadow-2xl">
               <h4 className="text-white text-sm font-bold uppercase mb-3 px-2 flex items-center justify-between">
                Location Map
                  <button 
                    onClick={handleOpenMap}
                    className="text-[10px] text-green-500 hover:underline bg-white/20 rounded-lg p-1 decoration-transparent transition-all hover:bg-white/30"
                    title='Get directions from your location'
                  >
                  Open in App
                </button>
               </h4>
               <iframe
                title="Map"
                src={mapUrl}
                className="w-full h-full rounded-2xl filter  opacity-100"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-10">
           <MoreDestinations />
        </div>
      </main>

      
      <Footer />
    </Body>
  );
};

export default DestinationDetail;