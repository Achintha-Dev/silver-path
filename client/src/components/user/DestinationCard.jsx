import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa'

const DestinationCard = ({ dest }) => {
  
  const CATEGORY_STYLES = {
    Nature:       'bg-green-500/30 text-white border-white/20',
    Heritage:     'bg-yellow-500/30 text-white border-white/20',
    Religious:    'bg-purple-500/30 text-white border-white/20',
    Cultural:     'bg-red-500/30 text-white border-white/20',
    Recreational: 'bg-teal-500/30 text-white border-white/20',
  }
  
  const extractTime = (text) => {
    if (!text) return "N/A";
    const match = text.match(/\d{1,2}:\d{2}\s?(AM|PM)\s?[–-]\s?\d{1,2}:\d{2}\s?(AM|PM)/i);
    return match ? match[0] : text;
  };
  
  // Extract the first image or use a placeholder if the images array is empty
  const mainImage = dest.images && dest.images.length > 0 
    ? dest.images[0].url 
    : 'https://via.placeholder.com/400x300?text=No+Image+Available';
    const badgeStyle = CATEGORY_STYLES[dest.category] || 'bg-gray-500/30 text-white border-white/20';
    
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
          onError={(e) => {         // handle broken image links
            e.target.src = 'https://placehold.co/400x300?text=No+Image+Available';
          }}
        />
        
        {/* Category Badge - Using the enum categories from destinations.js */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md rounded-lg border ${badgeStyle}`}>
            {dest.category}
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