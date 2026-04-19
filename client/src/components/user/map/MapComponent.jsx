import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapPopupContent from './MapPopup'

// Rideegama center coordinates
const RIDEEGAMA = { lat: 7.487647, lng: 80.470260 }

// Category marker colors
const CATEGORY_COLORS = {
  Nature:       '#22c55e',
  Heritage:     '#f59e0b',
  Religious:    '#a855f7',
  Cultural:     '#ef4444',
  Recreational: '#14b8a6',
}

// Create custom colored marker
const createColoredMarker = (color, isActive = false) => {
  const size = isActive ? 16 : 12
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 ${isActive ? '12px' : '6px'} ${color}80;
        transition: all 0.2s ease;
      "></div>
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

const MapComponent = ({ destinations, activeId, highlightId }) => {
  const markersRef = useRef({})

  // Find highlighted destination from URL param
  const highlightedDest = destinations.find(d => d._id === highlightId)

  // Open popup for active (hovered) destination
  useEffect(() => {
    if (activeId && markersRef.current[activeId]) {
      markersRef.current[activeId].openPopup()
    }
  }, [activeId])

  return (
    <MapContainer
      center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

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
        const color = CATEGORY_COLORS[dest.category] || '#94a3b8'
        const isActive = activeId === dest._id || highlightId === dest._id

        return (
          <Marker
            key={dest._id}
            position={[dest.location.lat, dest.location.lng]}
            icon={createColoredMarker(color, isActive)}
            ref={(ref) => {
              if (ref) markersRef.current[dest._id] = ref
            }}
          >
            <Popup maxWidth={220}>
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
  )
}

export default MapComponent