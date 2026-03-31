import Destination from '../models/destinations.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getAllDestinations = async (req, res) => {
    try {
        const { category, distance } = req.query

        let filter = {}

        // Filter by category if provided
        if (category && category !== 'All') {
          filter.category = category
        }

        // Filter by distance if provided
        if (distance) {
          filter.distanceFromRideegama  = { $lte: Number(distance) }
        }

        const destinations = await Destination.find(filter).sort({ distanceFromRideegama: 1 });
        return res.status(200).json({ success: true, data: destinations });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: error.message });
    }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
        return res.status(200).json({ success: true, data: destination });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private (Admin only)
export const createDestination = async (req, res) => {
    try {
        const { name, category, description, address,
            lat, lng, openingHours, entryFee,
            facilities, travelTips, distanceFromRideegama
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!category) missingFields.push('category (must be: Religious, Nature, Heritage, Cultural, or Recreational)');
        if (!description) missingFields.push('description');
        if (!address) missingFields.push('address');
        if (!lat) missingFields.push('lat');
        if (!lng) missingFields.push('lng');
        if (!openingHours) missingFields.push('openingHours');
        if (!distanceFromRideegama) missingFields.push('distanceFromRideegama');

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Missing required fields: ${missingFields.join(', ')}`,
                received: { name, category, description, address, lat, lng, openingHours, distanceFromRideegama }
            });
        }

        // Build images array from uploaded files
        const images = (req.files && req.files.length > 0) ? req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        })) : [];

        const newDestination = new Destination({
            name,
            category,
            description,
            address,
            location: { lat: Number(lat), lng: Number(lng) },
            openingHours,
            entryFee: entryFee || 'Free',
            facilities,
            travelTips,
            distanceFromRideegama: Number(distanceFromRideegama),
            images
        });

        // console.log("Destination object before save:", newDestination);
        
        const savedDestination = await newDestination.save();
        
        // console.log("Saved destination:", savedDestination);
        
        return res.status(201).json({ success: true, data: savedDestination });

    } catch (error) {
        console.error("Error creating destination:", error);
        return res.status(400).json({ 
            success: false, 
            message: error.message,
            details: error
        });
    }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private (Admin only)
export const updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });

        const { name, category, description, address,
            lat, lng, openingHours, entryFee,
            facilities, travelTips, distanceFromRideegama  
        } = req.body || {};

        // Only add new images if files were uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }))
            destination.images.push(...newImages)
        }

        // Update only provided fields
        if (name !== undefined) destination.name = name;
        if (category !== undefined) destination.category = category;
        if (description !== undefined) destination.description = description;
        if (address !== undefined) destination.address = address;
        if (lat !== undefined && lng !== undefined) {
            destination.location = { lat: Number(lat), lng: Number(lng) }
        }
        if (openingHours !== undefined) destination.openingHours = openingHours;
        if (entryFee !== undefined) destination.entryFee = entryFee;
        if (facilities !== undefined) destination.facilities = facilities;
        if (travelTips !== undefined) destination.travelTips = travelTips;
        if (distanceFromRideegama !== undefined) destination.distanceFromRideegama = Number(distanceFromRideegama);

        const updatedDestination = await destination.save()
        return res.status(200).json({ success: true, data: updatedDestination });

    } catch (error) {
        console.error('Error updating destination:', error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Add images to existing destination
// @route   POST /api/destinations/:id/images
// @access  Private (Admin only)
export const addImages = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' })
    }

    // Build new images array
    const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))

    // Push new images into existing images array
    destination.images.push(...newImages)
    await destination.save()

    res.status(200).json({ success: true, data: destination })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
};

// @desc    Delete single image from destination
// @route   DELETE /api/destinations/:id/images/:publicId
// @access  Private (Admin only)
export const deleteImage = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' })
    }

    // Prevent deleting if only 5 images remain
    if (destination.images.length <= 5) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete — minimum 5 images required per destination'
      })
    }

    const publicId = decodeURIComponent(req.params.publicId)

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId)

    // Remove from database
    destination.images = destination.images.filter(
      img => img.public_id !== publicId
    )
    await destination.save()

    res.status(200).json({ success: true, data: destination })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
};

// @desc    Delete destination + all its images
// @route   DELETE /api/destinations/:id
// @access  Private (Admin only)
export const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });

        // Delete entire Cloudinary folder for this destination
        if (destination.images.length > 0) {
            const publicIds = destination.images.map(img => img.public_id);
            await cloudinary.api.delete_resources(publicIds);

            // Delete the folder itself
            const folderName = destination.images[0].public_id.split('/').slice(0, -1).join('/');
            await cloudinary.api.delete_folder(folderName);
        }

        await Destination.findByIdAndDelete(req.params.id)
        return res.status(200).json({ success: true, message: 'Destination deleted successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};