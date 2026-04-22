import { getAllDestinations, getDestinationById, createDestination, updateDestination, addImages, deleteImage, deleteDestination } from '../controllers/destinationController.js';
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinaryConfig.js';
import { rateDestination, getDestinationRating } from '../controllers/ratingController.js'

const router = express.Router();

// @desc    Get all destinations
// @route   GET /api/destinations
router.get('/', getAllDestinations);

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
router.get('/:id', getDestinationById);

// @desc    Create a new destination
// @route   POST /api/destinations
router.post('/', protect, admin, upload.array('images', 5), createDestination);

// @desc    Update a destination
// @route   PUT /api/destinations/:id
router.put('/:id', protect, admin, upload.array('images', 5), updateDestination);

// @desc    Add images to a destination
// @route   POST /api/destinations/:id/images
router.post('/:id/images', protect, admin, upload.array('images', 5), addImages);

// @desc    Delete an image from a destination
// @route   DELETE /api/destinations/:id/images/:imageId
router.delete('/:id/images/:imageId', protect, admin, deleteImage);

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
router.delete('/:id', protect, admin, deleteDestination);

// @desc    Rate a destination
// @route   POST /api/destinations/:id/rating
router.post('/:id/rate', rateDestination);
router.get('/:id/rating', getDestinationRating);

export default router;