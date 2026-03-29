import dotenv from 'dotenv';
import { v2 as CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import multer from 'multer';

dotenv.config();

// Configure Cloudinary with your credentials (get these from your Cloudinary Dashboard)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
     const destName = req.body.name
      ? req.body.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      : 'unknown'

    const destId = req.params.id || 'new';

    return {
      folder: `silver_path_places/${destName}_${destId}`,
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }] // Resize to reasonable size
    };
  },

});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 } 
}); // 5MB max per image

export {  cloudinary, upload  };