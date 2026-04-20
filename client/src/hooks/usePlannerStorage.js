import { useState, useEffect } from 'react'

const KEYS = {
  selected:   'sp_planner_selected',
  itinerary:  'sp_planner_itinerary',
  distance:   'sp_planner_distance',
  generated:  'sp_planner_generated',
}

const load = (key, fallback) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn('localStorage unavailable')
  }
}

export const usePlannerStorage = () => {

  const [selected, setSelected_] = useState(() => load(KEYS.selected, []));
  const [itinerary, setItinerary_] = useState(() => load(KEYS.itinerary, []));
  const [totalDistance, setTotalDistance_] = useState(() => load(KEYS.distance, 0));
  const [itineraryGenerated, setItineraryGenerated_] = useState(() => load(KEYS.generated, false));
  const [isRestoredSession, setIsRestoredSession] = useState(
    () => load(KEYS.selected, []).length > 0
  );


  // Sync to localStorage via useEffect watching state
  useEffect(() => { save(KEYS.selected, selected) }, [selected]);
  useEffect(() => { save(KEYS.itinerary, itinerary) }, [itinerary]);
  useEffect(() => { save(KEYS.distance, totalDistance) }, [totalDistance]);
  useEffect(() => { save(KEYS.generated, itineraryGenerated) }, [itineraryGenerated]);

  // Wrapped setters — just use normal setState, useEffect handles storage
  const setSelected = (value) => setSelected_(value);
  const setItinerary = (value) => setItinerary_(value);
  const setTotalDistance = (value) => setTotalDistance_(value);
  const setItineraryGenerated = (value) => setItineraryGenerated_(value);

  const clearAll = () => {
    setSelected_([]);
    setItinerary_([]);
    setTotalDistance_(0);
    setItineraryGenerated_(false);
    setIsRestoredSession(false);
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }

  return {
    selected, setSelected,
    itinerary, setItinerary,
    totalDistance, setTotalDistance,
    itineraryGenerated, setItineraryGenerated,
    isRestoredSession,
    clearAll
  }
}