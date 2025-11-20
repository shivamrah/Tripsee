
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";


export const createBooking = async (req, res) => {
  const { tripId, seats, totalAmount, travelDate, fromLocation, tripSnapshot: tripSnapshotParam } = req.body;
  let tripSnapshot = tripSnapshotParam;
  const userId = req.user && req.user._id;

  // Log incoming payload for debugging (remove in production)
  console.log('createBooking called by user:', req.user ? req.user._id : 'no-user');
  console.log('createBooking payload:', { tripId, seats, totalAmount, travelDate, fromLocation });

  if (!userId) {
    console.error('createBooking: no authenticated user on request');
    return res.status(401).json({ message: 'Not authorized, no user' });
  }
  if (!tripId) {
    console.error('createBooking: missing tripId in payload');
    return res.status(400).json({ message: 'tripId is required' });
  }

  try {
    let trip = null;
    const seatsArr = Array.isArray(seats) ? seats : seats ? [seats] : [];

    if (mongoose.Types.ObjectId.isValid(tripId)) {
      trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      // Check seats against real trip
      if (seatsArr.length === 0) {
        return res.status(400).json({ message: "No seats selected" });
      }
      const isSeatTaken = seatsArr.some((seat) => trip.bookedSeats.includes(seat));
      if (isSeatTaken) {
        return res
          .status(400)
          .json({ message: "One or more selected seats are already booked" });
      }
    } else {
      // tripId is not an ObjectId.
      // If client provided a tripSnapshot, we'll use it. Otherwise, attempt to synthesize a minimal snapshot
      // for client-side example ids (format starts with "example-"). This helps when older/other clients
      // call the API without including a snapshot.
      if (!tripSnapshot) {
        if (typeof tripId === 'string' && tripId.startsWith('example-')) {
          // parse parts after 'example-'
          const parts = tripId.split('-');
          let stateParts = parts.slice(1);
          const last = stateParts[stateParts.length - 1];
          if (!isNaN(Number(last))) stateParts = stateParts.slice(0, -1);
          const stateName = decodeURIComponent(stateParts.join('-')).replace(/_/g, ' ');
          const inferredPrice = typeof totalAmount === 'number' ? totalAmount : Number(totalAmount) || 0;
          tripSnapshot = {
            _id: tripId,
            source: stateName,
            destination: stateName,
            date: new Date().toISOString(),
            time: '',
            price: inferredPrice,
            totalSeats: 0,
            bookedSeats: [],
            imageUrl: ''
          };
          console.info('createBooking: synthesized tripSnapshot for example id', tripId, tripSnapshot);
        } else {
          console.warn('createBooking: invalid tripId format and no tripSnapshot provided', tripId);
          return res.status(400).json({ message: 'Invalid tripId and no tripSnapshot provided.' });
        }
      }
      // For example trips we still require seats selection
      if (seatsArr.length === 0) {
        return res.status(400).json({ message: "No seats selected" });
      }
    }
    const bookingData = {
      user: userId,
      seats: seatsArr,
      totalAmount: typeof totalAmount === 'number' ? totalAmount : Number(totalAmount) || 0,
      travelDate: travelDate ? new Date(travelDate) : undefined,
      fromLocation: fromLocation || undefined,
    };

    if (trip) {
      bookingData.trip = trip._id;
    } else {
      // embed snapshot for demo trips
      bookingData.tripSnapshot = tripSnapshot;
    }

    const booking = new Booking(bookingData);
    // Debug logs: show booking payload and current trip state
    console.log('About to save booking with payload:', {
      user: userId,
      trip: tripId,
      seats: seatsArr,
      totalAmount: typeof totalAmount === 'number' ? totalAmount : Number(totalAmount) || 0,
      travelDate: travelDate ? new Date(travelDate) : undefined,
      fromLocation: fromLocation || undefined,
    });
    console.log('Booking payload used for save:', bookingData);
    const createdBooking = await booking.save();

    // If this was a real trip (ObjectId) update trip.bookedSeats
    if (trip) {
      if (seatsArr.length > 0) {
        trip.bookedSeats.push(...seatsArr);
        console.log('Updated trip.bookedSeats will be:', trip.bookedSeats);
      }
      try {
        await trip.save();
      } catch (tripSaveErr) {
        // Attempt to rollback booking to avoid inconsistent state
        console.error('Failed to save trip after booking; rolling back booking. Trip save error:', tripSaveErr);
        try {
          await Booking.findByIdAndDelete(createdBooking._id);
          console.log('Rolled back booking:', createdBooking._id);
        } catch (delErr) {
          console.error('Failed to rollback booking after trip save failure:', delErr);
        }
        return res.status(500).json({ message: 'Failed to update trip after booking; booking rolled back', error: tripSaveErr.message, stack: tripSaveErr.stack });
      }
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error("Error in createBooking:", error);
    // Return stack for debugging (remove in production)
    res.status(500).json({
      message: "Server error while creating booking",
      error: error.message,
      stack: error.stack,
    });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("trip");
    // Normalize each booking to include `tripInfo` which is either the populated `trip` or `tripSnapshot`
    const normalized = bookings.map((b) => {
      const obj = b.toObject ? b.toObject() : b;
      obj.tripInfo = obj.trip && Object.keys(obj.trip || {}).length > 0 ? obj.trip : obj.tripSnapshot || null;
      return obj;
    });
    res.json(normalized);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching bookings",
      error: error.message,
    });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("trip", "source destination date");
    const normalized = bookings.map((b) => {
      const obj = b.toObject ? b.toObject() : b;
      obj.tripInfo = obj.trip && Object.keys(obj.trip || {}).length > 0 ? obj.trip : obj.tripSnapshot || null;
      return obj;
    });
    res.json(normalized);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching all bookings" });
  }
};