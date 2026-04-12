import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa'

const DestinationCard = ({ dest }) => {
  // Extract the first image or use a placeholder if the images array is empty
  const mainImage = dest.images && dest.images.length > 0 
    ? dest.images[0].url 
    : 'https://via.placeholder.com/400x300?text=No+Image+Available';

  const categoryBadge = () => {
    if (dest.category == 'Nature' || dest.category == 'nature') {
      return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-green-500/30 backdrop-blur-md text-white rounded-lg border border-white/20">Nature</span>;

    } else if (dest.category == 'Heritage' || dest.category == 'Heritage') {
      return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-yellow-500/30 backdrop-blur-md text-white rounded-lg border border-white/20">Heritage</span>;

    } else if (dest.category == 'Religious' || dest.category == 'religious') {
      return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-purple-500/30 backdrop-blur-md text-white rounded-lg border border-white/20">Religious</span>;

    } else if (dest.category == 'Cultural' || dest.category == 'cultural'){
      return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-red-500/30 backdrop-blur-md text-white rounded-lg border border-white/20">Cultural</span>;

    } else {
      return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-teal-500/30 backdrop-blur-md text-white rounded-lg border border-white/20">Recreational</span>;
    }
  }

  const extractTime = (text) => {
  const match = text.match(/\d{1,2}:\d{2}\s?(AM|PM)\s?[–-]\s?\d{1,2}:\d{2}\s?(AM|PM)/i);
  return match ? match[0] : "N/A";
};

  return (
    <Link
      to={`/destinations/${dest._id}`}
      className="group relative block bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={mainImage}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Badge - Using the enum categories from destinations.js */}
        <div className="absolute top-4 left-4">
          {categoryBadge()}
        </div>

        {/* Distance Badge - Using distanceFromRideegama from your model */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="text-white text-[11px] font-bold flex items-center gap-1">
            <FaMapMarkerAlt className="text-green-400" />
            {dest.distanceFromRideegama} km away
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-xl font-black font-['Montserrat'] text-white uppercase tracking-tighter mb-2 group-hover:text-green-500 transition-colors">
          {dest.name}
        </h3>
        
        {/* Description - Clamped to 2 lines as per your controller's data */}
        <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
          {dest.description}
        </p>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-wider">
            <FaClock className="text-green-500/50" />
            <span>{extractTime(dest.openingHours)}</span>
          </div>
          
          
        </div>
      </div>

      {/* Glass Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent transition-opacity duration-500" />
    </Link>
  );
}

export default DestinationCard;