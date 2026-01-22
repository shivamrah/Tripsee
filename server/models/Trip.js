import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  // Legacy fields (kept for backward compatibility)
  placeName: {
    type: String,
  },
  state: {
    type: String,
  },
  description: {
    type: String,
  },
  tripCost: {
    type: Number,
  },
  
  // New fields (primary)
  source: {
    type: String,
  },
  destination: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  stateDescription: {
    type: String,
    default: "",
  },
  
  // Common fields
  imageUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  bookedSeats: {
    type: [String],
    default: [],
  },
  attractions: {
    type: [
      {
        name: String,
        price: Number,
        imagePath: String,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
