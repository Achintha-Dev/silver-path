import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import toast from 'react-hot-toast'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import Body from '../../components/user/Body'
import PlannerHeader from '../../components/user/planner/PlannerHeader'
import PlannerPicker from '../../components/user/planner/PlannerPicker'
import PlannerSelected from '../../components/user/planner/PlannerSelected'
import PlannerTabs from '../../components/user/planner/PlannerTabs'
import PlannerEmpty from '../../components/user/planner/PlannerEmpty'
import ItineraryTab from '../../components/user/planner/tabs/ItineraryTab'
import MapTab from '../../components/user/planner/tabs/MapTab'
import RouteTab from '../../components/user/planner/tabs/RouteTab'
import { usePlannerStorage } from '../../hooks/usePlannerStorage'
import { useUserLocation } from '../../hooks/useUserLocation.jsx'
import api from '../../utils/api'
import {
  haversineDistance,
  estimateVisitTime,
  estimateTravelTime,
  optimizeRoute
} from '../../utils/distance'

import { VscDebugRestart } from "react-icons/vsc";

const PlannerPage = () => {
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');


  // Custom hooks
  const { userLocation, locationStatus, referencePoint } = useUserLocation();
  const {
    selected, setSelected,
    itinerary, setItinerary,
    totalDistance, setTotalDistance,
    itineraryGenerated, setItineraryGenerated,
    isRestoredSession,
    clearAll
  } = usePlannerStorage();

  // Fetch destinations
  useEffect(() => {
    let mounted = true

    const fetch_ = async () => {
      try {
        const res = await api.get('/destinations')
        if (mounted) {
          setDestinations(res.data.data)

          const addId = searchParams.get('add')
          if (addId) {
            const dest = res.data.data.find(d => d._id === addId)
            if (dest) {
              setSelected(prev => {
                if (prev.some(s => s._id === addId)) return prev
                return [...prev, dest]
              })
            }
          }
        }
      } catch {
        if (mounted) {
          toast.error('Failed to load destinations')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    fetch_()

    return () => {
      mounted = false
    }
  }, []);

  // Add destination
  const handleAdd = (dest) => {
    if (selected.length >= 8) {
      toast.error('Maximum 8 destinations per day plan');
      return
    }
    setSelected(prev => [...prev, dest]);
    setItineraryGenerated(false);
  }

  // Remove destination
  const handleRemove = (id) => {
    setSelected(prev => prev.filter(d => d._id !== id));
    setItineraryGenerated(false);
  }

  // Clear everything
  const handleClearAll = () => {
    clearAll()
    setActiveTab('itinerary');
    toast.success('Planner cleared!');
  }

  // Generate itinerary
  const handleGenerate = useCallback(() => {
    if (selected.length < 2) {
      toast.error('Please select at least 2 destinations');
      return
    }

    setGenerating(true);

    try {
      const optimized = optimizeRoute(
        selected,
        referencePoint.lat,
        referencePoint.lng
      );

      let totalDist = 0
      const withTimes = optimized.map((dest, i) => {
        const visitTime = estimateVisitTime(dest.category);
        const distFromPrev = dest.distanceFromPrev || 0
        const travelTime = i === 0
          ? estimateTravelTime(
              haversineDistance(
                referencePoint.lat, referencePoint.lng,
                dest.location.lat, dest.location.lng
              )
            )
          : estimateTravelTime(distFromPrev);

        if (i > 0) totalDist += distFromPrev

        return {
          ...dest,
          visitTime,
          travelTime,
          ...(i === 0 && {
            distanceFromStart: haversineDistance(
              referencePoint.lat, referencePoint.lng,
              dest.location.lat, dest.location.lng
            )
          })
        };
      })

      setTotalDistance(totalDist);
      setItinerary(withTimes);
      setItineraryGenerated(true);
      setActiveTab('itinerary');
      toast.success('Your day plan is ready!');

    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, referencePoint]);

  return (
    <Body>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">

        {/* Header */}
        <PlannerHeader
          locationStatus={locationStatus}
          isRestoredSession={isRestoredSession}
          onClearAll={handleClearAll}
        />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Picker + Selected + Generate */}
          <div className="lg:col-span-1 space-y-4">
            <div className="h-[420px]">
              <PlannerPicker
                destinations={destinations}
                selected={selected}
                onAdd={handleAdd}
                onRemove={handleRemove}
                loading={loading}
              />
            </div>

            <PlannerSelected
              selected={selected}
              onRemove={handleRemove}
              onClear={handleClearAll}
              onGenerate={handleGenerate}
              generating={generating}
            />
          </div>

          {/* Right — Results */}
          <div className="lg:col-span-2">
            {!itineraryGenerated ? (
              <PlannerEmpty />
            ) : (
              <div className="space-y-4">

                {/* Tabs */}
                <PlannerTabs
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />

                {/* Tab content */}
                {activeTab === 'itinerary' && (
                  <ItineraryTab
                    itinerary={itinerary}
                    totalDistance={totalDistance}
                    userLocationUsed={locationStatus === 'granted'}
                  />
                )}

                {activeTab === 'map' && (
                  <MapTab
                    itinerary={itinerary}
                    userLocation={userLocation}
                  />
                )}

                {activeTab === 'route' && (
                  <RouteTab
                    itinerary={itinerary}
                    userLocation={userLocation}
                  />
                )}

                {/* Regenerate */}
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white font-bold uppercase tracking-wider rounded-2xl transition-all text-xs"
                >
                 <VscDebugRestart className='inline-block size-5'/> Regenerate Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </Body>
  )
}

export default PlannerPage