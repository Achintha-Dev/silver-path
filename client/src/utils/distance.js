// Haversine formula — calculates straight-line distance between two GPS points
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // distance in km
}

// Estimate visit time based on category (in minutes)
export const estimateVisitTime = (category) => {
  const times = {
    Religious:    60,   // temples, shrines
    Heritage:     75,   // historical sites
    Nature:       90,   // nature spots, hikes
    Cultural:     60,   // cultural venues
    Recreational: 120,  // recreational areas
  }
  return times[category] || 60
}

// Estimate travel time based on distance (assumes avg 40 km/h on local roads)
export const estimateTravelTime = (distanceKm) => {
  const avgSpeedKmH = 40
  return Math.round((distanceKm / avgSpeedKmH) * 60) // minutes
}

// Format minutes to human readable
export const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// Format clock time from minutes offset
export const formatClock = (startHour, offsetMinutes) => {
  const totalMinutes = startHour * 60 + offsetMinutes
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

// Nearest neighbor algorithm — optimizes visiting order
export const optimizeRoute = (destinations, userLat, userLng) => {
  if (destinations.length === 0) return []
  if (destinations.length === 1) return destinations

  const remaining = [...destinations]
  const route = []

  // Start from nearest to user location
  let currentLat = userLat
  let currentLng = userLng

  while (remaining.length > 0) {
    let nearestIndex = 0
    let nearestDist = Infinity

    remaining.forEach((dest, i) => {
      const dist = haversineDistance(
        currentLat, currentLng,
        dest.location.lat, dest.location.lng
      )
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIndex = i
      }
    })

    const nearest = remaining[nearestIndex]
    route.push({
      ...nearest,
      distanceFromPrev: nearestDist
    })

    currentLat = nearest.location.lat
    currentLng = nearest.location.lng
    remaining.splice(nearestIndex, 1)
  }

  return route
}