import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Religious', 'Nature', 'Heritage', 'Cultural', 'Recreational']
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: { 
        type: Number, 
        required: true,  
        min: [7.46, 'Latitude must be between 7.46 and 7.63'],
        max: [7.63, 'Latitude must be between 7.46 and 7.63'] 
    },
    lng: { 
        type: Number,
        required: true,
        min: [80.44, 'Longitude must be between 80.44 and 80.60'],
        max: [80.60, 'Longitude must be between 80.44 and 80.60']
     }
  },
  openingHours: {
    type: String,
    required: true
  },
  entryFee: {
    type: String,
    default: 'Free' 
  },
  facilities: {
    type: String  
  },
  travelTips: {
    type: String
  },
  // Cloudinary Image Data
  image: {
    url: String,      // The URL provided by Cloudinary to show the image
    public_id: String // Useful if you want to delete/replace the image later
  },
  distanceFromRideegama: {
    type: Number, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;