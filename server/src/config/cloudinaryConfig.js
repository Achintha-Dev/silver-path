import dotenv from 'dotenv';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary.v2';
import multer from 'multer';
dotenv.config();

// Configure Cloudinary with your credentials (get these from your Cloudinary Dashboard)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'silver_path_places', // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };