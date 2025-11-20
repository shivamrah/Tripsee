import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // Either `trip` (reference to Trip collection) or `tripSnapshot` (embedded data for example/demo trips)
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
  tripSnapshot: {
    type: Object,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  fromLocation: {
    type: String,
  },
  travelDate: {
    type: Date,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

// Ensure at least one of trip or tripSnapshot is present
bookingSchema.pre('validate', function (next) {
  if (!this.trip && !this.tripSnapshot) {
    next(new Error('Either trip (ObjectId) or tripSnapshot (object) must be provided'));
  } else {
    next();
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
