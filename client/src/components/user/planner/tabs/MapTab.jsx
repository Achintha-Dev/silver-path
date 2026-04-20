import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { MdLocationPin } from "react-icons/md";
import { FaArrowsAltH } from "react-icons/fa";

const RIDEEGAMA = { lat: 7.487647, lng: 80.470260 }

const CATEGORY_COLORS = {
  Nature:       '#22c55e',
  Heritage:     '#f59e0b',
  Religious:    '#a855f7',
  Cultural:     '#ef4444',
  Recreational: '#14b8a6',
}

const createStepMarker = (color, step) => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:${color};border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${color}60;font-size:11px;font-weight:900;color:white;">${step}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
})

const createUserMarker = () => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px #3b82f680;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
})

const FitBounds = ({ positions }) => {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] })
    } else if (positions.length === 1) {
      map.setView(positions[0], 13)
    }
  }, [positions, map])
  return null
}

const MapTab = ({ itinerary, userLocation }) => {

  // Always use reference point as START of route
  const startPoint = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [RIDEEGAMA.lat, RIDEEGAMA.lng]

  const destPositions = itinerary.map(d => [d.location.lat, d.location.lng])
  const allPositions = [startPoint, ...destPositions]

  return (
    <div className="h-[550px] rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {/* 25km radius */}
        <Circle
          center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
          radius={25000}
          pathOptions={{
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.03,
            weight: 1.5,
            dashArray: '6 4'
          }}
        />

        {/* Straight line route */}
        {allPositions.length > 1 && (
          <Polyline
            positions={allPositions}
            pathOptions={{
              color: '#60a5fa',
              weight: 2.5,
              opacity: 0.6,
              dashArray: '8 4'
            }}
          />
        )}

        {/* Start marker */}
        <Marker position={startPoint} icon={createUserMarker()}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '12px' }}>
                {userLocation ? 'Your Location' : 'Rideegama'}
              </strong>
              <p style={{ fontSize: '10px', color: '#64748b' }}>
                {userLocation ? 'Starting from here' : 'Center reference point'}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Destination markers */}
        {itinerary.map((dest, i) => (
          <Marker
            key={dest._id}
            position={[dest.location.lat, dest.location.lng]}
            icon={createStepMarker(CATEGORY_COLORS[dest.category] || '#94a3b8', i + 1)}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '12px' }}>{dest.name}</strong>
                <p style={{ fontSize: '10px', color: '#64748b' }}>
                  Stop #{i + 1} · {dest.category}
                </p>
                {i === 0 && dest.distanceFromStart && (
                  <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    <MdLocationPin className='inline-block' /> {dest.distanceFromStart.toFixed(1)} km from start
                  </p>
                )}
                {i > 0 && dest.distanceFromPrev && (
                  <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    <FaArrowsAltH className='inline-block' /> {dest.distanceFromPrev.toFixed(1)} km from previous stop
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBounds positions={allPositions} />
      </MapContainer>
    </div>
  )
}

export default MapTab