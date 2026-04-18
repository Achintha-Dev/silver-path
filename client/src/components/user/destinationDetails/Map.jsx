import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'

function Map({ destination, RIDEEGAMA }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-black uppercase tracking-wider text-sm">
            Location
        </h2>
        </div>
        <div className="h-64 md:h-80 z-10 relative">
        <MapContainer
            center={[destination.location.lat, destination.location.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
            />
            {/* Destination marker */}
            <Marker position={[destination.location.lat, destination.location.lng]}>
            <Popup>
                <div className="text-center">
                <strong>{destination.name}</strong>
                <br />
                <span className="text-xs text-gray-600">{destination.category}</span>
                </div>
            </Popup>
            </Marker>
            {/* Rideegama reference circle */}
            <Circle
            center={[RIDEEGAMA.lat, RIDEEGAMA.lng]}
            radius={25000}
            pathOptions={{
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.05,
                weight: 1,
                dashArray: '5 5'
            }}
            />
        </MapContainer>
        </div>
    </div>
  )
}

export default Map