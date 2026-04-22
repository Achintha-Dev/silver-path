import Destination from '../models/destinations.js'
import crypto from 'crypto'

// Create anonymous user hash from IP + User Agent
// This prevents duplicate ratings without requiring login
const createUserHash = (req) => {
  const identifier = (req.ip || '') + (req.headers['user-agent'] || '');
  return crypto.createHash('sha256').update(identifier).digest('hex');
}

// @desc    Rate a destination
// @route   POST /api/destinations/:id/rate
// @access  Public
export const rateDestination = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Ensure ratings array exists
    if (!destination.ratings) {
      destination.ratings = [];
    }

    const userHash = createUserHash(req);

    // Check if user already rated
    const existingRatingIndex = destination.ratings.findIndex(
      r => r.ipHash === userHash
    )

    if (existingRatingIndex !== -1) {
      // Update existing rating
      destination.ratings[existingRatingIndex].rating = Number(rating);
    } else {
      // Add new rating
      destination.ratings.push({
        ipHash: userHash,
        rating: Number(rating)
      });
    }

    // Recalculate average
    const total = destination.ratings.length;
    const sum = destination.ratings.reduce((acc, r) => acc + r.rating, 0);
    destination.averageRating = Math.round((sum / total) * 10) / 10;
    destination.totalRatings = total;

    await destination.save();

    return res.status(200).json({
      success: true,
      data: {
        averageRating: destination.averageRating,
        totalRatings: destination.totalRatings,
        userRating: Number(rating)
      }
    });

  } catch (error) {
    console.error('Rating error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// @desc    Get rating for a destination
// @route   GET /api/destinations/:id/rating
// @access  Public
export const getDestinationRating = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .select('averageRating totalRatings ratings');

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Check if current user already rated
    const userHash = createUserHash(req);

    // Guard against missing ratings array
    const ratings = destination.ratings || []
    const userRating = ratings.find(r => r.ipHash === userHash)

    return res.status(200).json({
      success: true,
      data: {
        averageRating: destination.averageRating,
        totalRatings: destination.totalRatings,
        userRating: userRating?.rating || null
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}