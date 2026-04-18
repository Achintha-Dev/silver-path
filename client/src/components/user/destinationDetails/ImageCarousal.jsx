import React from 'react'
import { FaChevronLeft, FaChevronRight, FaArrowCircleRight} from 'react-icons/fa';

function ImageCarousal({destination, mainImage, setLightboxOpen, currentImageIndex, nextImage, prevImage, CATEGORY_COLORS, setCurrentImageIndex}) {

  return (
    <div>
        {/* Main Image */}
        <div
            className="relative h-72 md:h-[420px] rounded-3xl overflow-hidden cursor-pointer group"
            onClick={() => setLightboxOpen(true)}
        >
            <img
            src={mainImage}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
                e.target.src = 'https://placehold.co/800x500?text=No+Image'
            }}
            />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border backdrop-blur-md ${CATEGORY_COLORS[destination.category]}`}>
                    {destination.category}
                </span>
            </div>

            {/* View Gallery hint */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">
                    View Gallery <FaArrowCircleRight className="inline ml-1 size-5 mb-1" />
                </span>
            </div>

            {/* Image counter */}
            {destination.images?.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                <span className="text-white text-xs font-bold">
                    {currentImageIndex + 1} / {destination.images.length}
                </span>
            </div>
            )}

            {/* Prev/Next on main image */}
            {destination.images?.length > 1 && (
            <>
                <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                    <FaChevronLeft />
                </button>

                <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                    <FaChevronRight />
                </button>
            </>
            )}
        </div>

        {/* Thumbnail Strip */}
        {destination.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mt-2 pt-2 pl-1">
                {destination.images.map((img, i) => (
                    <button
                    key={img.public_id || i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        i === currentImageIndex
                        ? 'border-white opacity-100 scale-105'
                        : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                    >
                    <img
                        src={img.url}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                    />
                    </button>
                ))}
            </div>
        )}
    </div>
  )
}

export default ImageCarousal