export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(1)
}

// Generate optimized visit order based on proximity
export const optimizeRoute = (destinations) => {
  if (destinations.length <= 2) return destinations

  const visited = [destinations[0]]
  const remaining = [...destinations.slice(1)]

  while (remaining.length > 0) {
    const last = visited[visited.length - 1]
    let nearestIndex = 0
    let nearestDist = Infinity

    remaining.forEach((dest, index) => {
      const dist = calculateDistance(
        last.location.lat, last.location.lng,
        dest.location.lat, dest.location.lng
      )
      if (Number(dist) < nearestDist) {
        nearestDist = Number(dist)
        nearestIndex = index
      }
    })

    visited.push(remaining[nearestIndex])
    remaining.splice(nearestIndex, 1)
  }

  return visited
}