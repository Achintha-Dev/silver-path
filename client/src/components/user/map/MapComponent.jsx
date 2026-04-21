import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapPopupContent from './MapPopup'

import { renderToStaticMarkup } from 'react-dom/server'
import { ImLeaf } from 'react-icons/im'
import { FaVihara,FaUsers, FaHiking, FaPray, FaLandmark, FaExpand, FaCompress } from "react-icons/fa";

// Custom styles for centered popups
const popupStyles = `
  .popup-center .leaflet-popup-content-wrapper {
    border-radius: 16px !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  
  .popup-center .leaflet-popup-content {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    display: flex !important;
    justify-content: center !important;
  }
  
  .popup-center .leaflet-popup-tip-container {
    display: flex !important;
    justify-content: center !important;
  }
  
  .popup-center .leaflet-popup-tip {
    background: transparent !important;
    border: none !important;
  }
`;

// Rideegama center coordinates
const RIDEEGAMA = { lat: 7.487647, lng: 80.470260 }

// Category marker colors
const CATEGORY_ICONS = {
  Nature: <ImLeaf className='text-green-400 border-green-200/20 shadow-lg'/>,
  Heritage: <FaLandmark className='text-yellow-400 border-yellow-200/20 shadow-lg '/>,
  Religious: <FaVihara className='text-purple-500 border-purple-200/20 shadow-lg '/>,
  Cultural: <FaUsers className='text-red-400 border-red-200/20 shadow-lg '/>,
  Recreational: <FaHiking className='text-teal-400 border-teal-200/20 shadow-lg '/>,
}

const CATEGORY_COLORS = {
  Nature:       '#79AB8A',
  Heritage:     '#f59e0b',
  Religious:    '#B1A0BD',
  Cultural:     '#ef4444',
  Recreational: '#14b8a6',
}

// Create custom colored marker
const createColoredMarker = (color, category, isActive = false) => {
  const size = isActive ? 32 : 28;
  // Use white color for the icon inside the colored circle
  const iconHtml = renderToStaticMarkup(
    CATEGORY_ICONS[category] || <FaCircle />
  );

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color}; /* This uses the Hex from CATEGORY_COLORS */
        color: white;              /* This makes the Icon white */
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size / 2}px;
        box-shadow: 0 2px 10px ${color}80;
        transition: all 0.2s ease;
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)]
  })

}

// Rideegama center marker
const createCenterMarker = () => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 14px;
        height: 14px;
        background-color: #60a5fa;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 12px #60a5fa80;
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7]
  })
}

// Component to fly to highlighted destination
const FlyToDestination = ({ destination }) => {
  const map = useMap()
  useEffect(() => {
    if (destination) {
      map.flyTo(
        [destination.location.lat, destination.location.lng],
        15,
        { duration: 1.2 }
      )
    }
  }, [destination, map])
  return null
}

// Map fullscreen control component

const FullScreenButton = ({ isFullscreen, setFullscreen }) => {

  // KEYBOARD SHORTCUT: Press 'Esc' to exit fullscreen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setFullscreen]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '12px', marginRight: '12px' }}>
      <div className="leaflet-control">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFullscreen(!isFullscreen);
          }}
          className="flex items-center justify-center w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-white shadow-2xl hover:bg-black/20 transition-all pointer-events-auto active:scale-90"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
        </button>
      </div>
    </div>
  );
};

const MapComponent = ({ destinations, activeId, highlightId, isFullscreen, setFullscreen }) => {
  const markersRef = useRef({});

  // Inject popup centering styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = popupStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Find highlighted destination from URL param
  const highlightedDest = destinations.find(d => d._id === highlightId);

  // Open popup for active (hovered) destination
  useEffect(() => {
    if (activeId && markersRef.current[activeId]) {
      markersRef.current[activeId].openPopup()
    }
  }, [activeId]);

  return (
    <MapContainer
      center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
      zoom={11}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      zoomControl={true}
      
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Fullscreen control */}
      <FullScreenButton isFullscreen={isFullscreen} setFullscreen={setFullscreen} />

      {/* 25km radius circle */}
      <Circle
        center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
        radius={25000}
        pathOptions={{
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.04,
          weight: 1.5,
          dashArray: '6 4'
        }}
      />

      {/* Rideegama center marker */}
      <Marker
        position={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
        icon={createCenterMarker()}
      >
        <Popup>
          <div style={{ textAlign: 'center', padding: '4px' }}>
            <strong style={{ fontSize: '12px' }}>Rideegama</strong>
            <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0' }}>
              Reference center point
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Destination markers */}
      {destinations.map((dest) => {
        // GET THE HEX COLOR STRING HERE
        const circleColor = CATEGORY_COLORS[dest.category] || '#94a3b8';
        
        const isActive = activeId === dest._id || highlightId === dest._id;

        return (
          <Marker
            key={dest._id}
            position={[dest.location.lat, dest.location.lng]}
            // Pass the Hex string AND the category name
            icon={createColoredMarker(circleColor, dest.category, isActive)} 
            ref={(ref) => {
              if (ref) markersRef.current[dest._id] = ref
            }}
          >
            {/* Popup content */}
            <Popup 
              maxWidth={260}
              className="popup-center"
              autoPan={true}
              autoPanPadding={[50, 50]}
            >
              <MapPopupContent destination={dest} />
            </Popup>
          </Marker>
        )
      })}

      {/* Fly to highlighted destination */}
      {highlightedDest && (
        <FlyToDestination destination={highlightedDest} />
      )}
    </MapContainer>
  );
}

export default MapComponent