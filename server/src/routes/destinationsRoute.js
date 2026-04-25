import { getAllDestinations, getDestinationById, createDestination, updateDestination, addImages, deleteImage, deleteDestination } from '../controllers/destinationController.js';
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinaryConfig.js';
import { rateDestination, getDestinationRating } from '../controllers/ratingController.js'

const router = express.Router();

// Public routes
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.get('/:id/rating', getDestinationRating);

// Protected routes
router.post('/', protect, admin, upload.array('images', 20), createDestination);
router.put('/:id', protect, admin, upload.array('images', 20), updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

// Image management — specific routes BEFORE dynamic ones
router.post('/:id/images/delete', protect, admin, deleteImage);        // POST + specific path first
router.post('/:id/images', protect, admin, upload.array('images', 20), addImages)
;
// Rating
router.post('/:id/rate', rateDestination);

export default router;