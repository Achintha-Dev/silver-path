import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaSpinner, FaExclamationTriangle, FaCar } from 'react-icons/fa'
import { IoCarSportSharp } from "react-icons/io5";
import { formatTime } from '../../../../utils/distance'

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
  html: `<div style="width:30px;height:30px;background:${color};border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${color}60;font-size:12px;font-weight:900;color:white;">${step}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
})

const createUserMarker = () => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px #3b82f680;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
})

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    }
  }, [positions, map]);
  return null
}

const fetchRoadRoute = async (coordinates) => {
  const coordStr = coordinates.map(c => `${c[1]},${c[0]}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No route found');
  const route = data.routes[0]
  return {
    roadPath: route.geometry.coordinates.map(c => [c[1], c[0]]),
    legs: route.legs.map(leg => ({
      distance: (leg.distance / 1000).toFixed(1),
      duration: Math.round(leg.duration / 60)
    })),
    totalDistance: (route.distance / 1000).toFixed(1),
    totalDuration: Math.round(route.duration / 60)
  }
}

const RouteTab = ({ itinerary, userLocation }) => {
  const [roadPath, setRoadPath] = useState([]);
  const [legs, setLegs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error

  const startPoint = useMemo(() => {

    // Start from user location or Rideegama
    return userLocation 
      ? [userLocation.lat, userLocation.lng] 
      : [RIDEEGAMA.lat, RIDEEGAMA.lng];
  }, [userLocation]);

  const allPoints = useMemo(() => {
    return [startPoint, ...itinerary.map(d => [d.location.lat, d.location.lng])];
  }, [startPoint, itinerary]);

  useEffect(() => {
    if (itinerary.length < 1) return
    const load = async () => {
      setStatus('loading');
      try {
        const result = await fetchRoadRoute(allPoints);
        setRoadPath(result.roadPath);
        setLegs(result.legs);
        setSummary({ distance: result.totalDistance, duration: result.totalDuration });
        setStatus('success');

      } catch {
        setRoadPath(allPoints);
        setStatus('error');
      }
    }
    load()
  }, [allPoints, itinerary.length]);

  return (
    <div className="space-y-4">

      {/* Error notice */}
      {status === 'error' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-400/20 rounded-xl">
          <FaExclamationTriangle className="text-amber-400 text-xs flex-shrink-0" />
          <p className="text-amber-300 text-xs">
            Could not load road route — showing straight-line path instead.
          </p>
        </div>
      )}

      {/* Summary */}
      {status === 'success' && summary && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Total Road Distance</p>
              <p className="text-white font-black text-xl">{summary.distance} km</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Total Drive Time</p>
              <p className="text-white font-black text-xl">~{formatTime(summary.duration)}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Stops</p>
              <p className="text-white font-black text-xl">{itinerary.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Road segments */}
      {legs.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">
              Road Segments
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {legs.map((leg, i) => {
              const fromName = i === 0
                ? (userLocation ? 'Your Location' : 'Rideegama')
                : itinerary[i - 1]?.name
              const toName = itinerary[i]?.name

              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <FaCar className="text-white/20 text-xs flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-[10px] truncate">
                      {fromName} → <span className="text-white font-bold">{toName}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-xs font-bold">{leg.distance} km</p>
                    <p className="text-white/40 text-[10px]">~{leg.duration} min</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-[500px] rounded-2xl overflow-hidden border border-white/10 relative">
        {status === 'loading' && (
          <div className="absolute inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <FaSpinner className="text-white text-2xl animate-spin" />
            <p className="text-white/60 text-xs uppercase tracking-widest">
              Loading road route from {userLocation ? 'your location' : 'Rideegama'}...
            </p>
          </div>
        )}

        <MapContainer
          center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
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

          {roadPath.length > 1 && (
            <Polyline
              positions={roadPath}
              pathOptions={{ color: '#60a5fa', weight: 4, opacity: 0.85 }}
            />
          )}

          <Marker position={startPoint} icon={createUserMarker()}>
            <Popup>
              <strong style={{ fontSize: '12px' }}>
                {userLocation ? 'Your Location' : 'Rideegama'}
              </strong>
              <p style={{ fontSize: '10px', color: '#64748b' }}>Starting point</p>
            </Popup>
          </Marker>

          {itinerary.map((dest, i) => (
            <Marker
              key={dest._id}
              position={[dest.location.lat, dest.location.lng]}
              icon={createStepMarker(CATEGORY_COLORS[dest.category] || '#94a3b8', i + 1)}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '12px' }}>{dest.name}</strong>
                  <p style={{ fontSize: '10px', color: '#64748b' }}>Stop #{i + 1}</p>
                  {legs[i] && (
                    <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                      <IoCarSportSharp className='inline-block' /> {legs[i].distance} km · ~{legs[i].duration} min
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <FitBounds positions={allPoints} />
        </MapContainer>
      </div>

      <p className="text-white/20 text-[10px] text-center">
        Road routing powered by OSRM + OpenStreetMap
      </p>
    </div>
  )
}

export default RouteTab