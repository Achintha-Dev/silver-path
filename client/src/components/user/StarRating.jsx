import { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const STORAGE_KEY = 'sp_ratings' // localStorage key

// Load all saved ratings from localStorage
const getSavedRatings = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

// Save a rating to localStorage
const saveRatingLocally = (destId, rating) => {
  try {
    const saved = getSavedRatings();
    saved[destId] = rating;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  } catch {
    console.warn('localStorage unavailable');
  }
}

const StarRating = ({ destinationId, showCount = true, size = 'md', readOnly = false, initialAverageRating = 0, initialTotalRatings = 0 }) => {
  
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [userRating, setUserRating] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  // Fetch rating from server on mount
  useEffect(() => {

    // Skip API call completely for read-only cards
    if (readOnly) return

    // Also skip if no destinationId
    if (!destinationId) return

    let cancelled = false  // Prevent state update on unmounted component

    const fetchRating = async () => {
      setLoading(true);

      try {

        const res = await api.get(`/destinations/${destinationId}/rating`);
        if (cancelled) return  // Component unmounted — skip state update

        setAverageRating(res.data.data.averageRating || 0);
        setTotalRatings(res.data.data.totalRatings || 0);

        // Check localStorage first (faster than server check)
        const saved = getSavedRatings();

        if (saved[destinationId]) {
          setUserRating(saved[destinationId]);

        } else if (res.data.data.userRating) {
          setUserRating(res.data.data.userRating);
        }
      } catch (error) {
        console.error('Failed to fetch rating:', error);
        setAverageRating(0);
        setTotalRatings(0);

      } finally {
        setLoading(false);
      }
    }

    fetchRating();

    return () => {
      cancelled = true
    }

  }, [destinationId, readOnly]);

  const handleRate = async (rating) => {
    if (readOnly || submitting) return

    setSubmitting(true);
    try {
      const res = await api.post(`/destinations/${destinationId}/rate`, { rating });

      setAverageRating(res.data.data.averageRating);
      setTotalRatings(res.data.data.totalRatings);
      setUserRating(rating);

      // Save to localStorage to persist across sessions
      saveRatingLocally(destinationId, rating);

      if (userRating) {
        toast.success(`Rating updated to ${rating} star${rating !== 1 ? 's' : ''}!`);
      } else {
        toast.success(`Rated ${rating} star${rating !== 1 ? 's' : ''}!`);
      }

    } catch (error) {
      toast.error('Failed to submit rating' + (error.response?.data?.message ? `: ${error.response.data.message}` : ''));
      console.error('Rating submission error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  const starSize = sizeClasses[size] || sizeClasses.md

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="w-4 h-4 bg-white/10 rounded animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">

      {/* Stars row */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
            
          const isFilled = readOnly
            ? star <= Math.round(averageRating)
            : star <= (hovered || userRating || 0);
          
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly || submitting}
              onMouseEnter={() => !readOnly && setHovered(star)}
              onMouseLeave={() => !readOnly && setHovered(null)}
              onClick={() => handleRate(star)}
              className={`transition-all duration-150 ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-125 active:scale-110'
              } ${submitting ? 'opacity-50' : ''}`}
            >
              <FaStar
                className={`${starSize} transition-colors duration-150 ${
                  isFilled
                    ? 'text-amber-400'
                    : 'text-white/20'
                }`}
              />
            </button>
          )
        })}

        {/* Average + count */}
        {showCount && totalRatings > 0 && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-white font-bold text-xs">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-white/40 text-[10px]">
              ({totalRatings})
            </span>
          </div>
        )}

        {/* No ratings yet */}
        {showCount && totalRatings === 0 && !readOnly && (
          <span className="text-white/30 text-[10px] ml-1">
            Be the first to rate
          </span>
        )}
      </div>

      {/* User rating feedback */}
      {!readOnly && userRating && (
        <p className="text-white/40 text-[10px]">
          Your rating: {userRating} star{userRating !== 1 ? 's' : ''} · Click to change
        </p>
      )}

      {/* Hover hint */}
      {!readOnly && !userRating && hovered && (
        <p className="text-amber-400/70 text-[10px]">
          Click to rate {hovered} star{hovered !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

export default StarRating