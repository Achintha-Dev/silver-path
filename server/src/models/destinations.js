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
        min: [7.46, 'Latitude must be between 7.46 and 7.70'],
        max: [7.70, 'Latitude must be between 7.46 and 7.70'] 
    },
    lng: { 
        type: Number,
        required: true,
        min: [80.30, 'Longitude must be between 80.30 and 80.70'],
        max: [80.70, 'Longitude must be between 80.30 and 80.70']
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
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  distanceFromRideegama: {
    type: Number, 
    required: true
  },
  // rating fields
  ratings: {
  type: [
    {
      ipHash: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
  default: []  // empty array by default
},
averageRating: {
  type: Number,
  default: 0,
  min: 0,
  max: 5
},
totalRatings: {
  type: Number,
  default: 0
}

}, { timestamps: true });

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;