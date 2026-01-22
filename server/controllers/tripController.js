import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";

export const createTrip = async (req, res) => {
  try {
    // Extract all possible field names
    const {
      source,
      destination,
      date,
      time,
      price,
      totalSeats,
      stateDescription,
      attractions,
      // Legacy names
      placeName,
      state,
      description,
      tripCost
    } = req.body;

    // Validate required fields
    if (!destination || !date || !time || !totalSeats) {
      return res.status(400).json({ message: "Missing required fields: destination, date, time, totalSeats" });
    }

    // Handle image URL
    let imageUrl = "https://source.unsplash.com/800x600/?travel";
    if (req.file) {
      if (req.file.filename) {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.file.path) {
        imageUrl = req.file.path;
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Create trip with both old and new field names for compatibility
    const tripData = {
      // New fields
      source: source || placeName || "",
      destination,
      date: new Date(date),
      time,
      price: price !== undefined ? Number(price) : (tripCost ? Number(tripCost) : 0),
      totalSeats: Number(totalSeats),
      imageUrl,
      stateDescription: stateDescription || description || "",
      attractions: attractions ? (typeof attractions === 'string' ? JSON.parse(attractions) : attractions) : [],

      // Legacy fields (for backward compatibility)
      placeName: placeName || source || "",
      state: state || "",
      description: description || stateDescription || "",
      tripCost: tripCost || price || 0,
    };

    const trip = new Trip(tripData);
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    console.error("createTrip error:", error);
    res.status(500).json({ message: "Error creating trip", error: error.message });
  }
};


export const getTrips = async (req, res) => {
  try {
    const filter = {};

    // Support both field name searches
    if (req.query.placeName) {
      filter.$or = [
        { placeName: { $regex: req.query.placeName, $options: "i" } },
        { source: { $regex: req.query.placeName, $options: "i" } }
      ];
    }
    if (req.query.destination) {
      filter.destination = { $regex: req.query.destination, $options: "i" };
    }
    if (req.query.source) {
      filter.source = { $regex: req.query.source, $options: "i" };
    }
    if (req.query.state) {
      filter.$or = [
        ...(filter.$or || []),
        { state: { $regex: req.query.state, $options: "i" } }
      ];
    }
    if (req.query.date) {
      const searchDate = new Date(req.query.date);
      const nextDay = new Date(req.query.date);
      nextDay.setDate(searchDate.getDate() + 1);
      filter.date = { $gte: searchDate, $lt: nextDay };
    }

    // SORT BY TRIP DATE ASCENDING (earliest trips first)
    const trips = await Trip.find(filter).sort({ date: 1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error: error.message });
  }
};


export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      res.json(trip);
    } else {
      res.status(404).json({ message: "Trip not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trip", error: error.message });
  }
};


export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      // Support both field name conventions
      trip.source = req.body.source || req.body.placeName || trip.source;
      trip.destination = req.body.destination || trip.destination;
      trip.stateDescription = req.body.stateDescription || trip.stateDescription;

      // Handle date conversion properly
      if (req.body.date) {
        trip.date = new Date(req.body.date);
      }

      trip.time = req.body.time || trip.time;
      trip.price = req.body.price ? Number(req.body.price) : (trip.price || req.body.tripCost ? Number(req.body.tripCost) : trip.price);
      trip.totalSeats = req.body.totalSeats ? Number(req.body.totalSeats) : trip.totalSeats;

      // Handle attractions
      if (req.body.attractions) {
        trip.attractions = typeof req.body.attractions === 'string' ? JSON.parse(req.body.attractions) : req.body.attractions;
      }

      // Handle image upload - support both local and Cloudinary
      if (req.file) {
        if (req.file.filename) {
          // Local file upload
          trip.imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.file.path) {
          // Cloudinary upload
          trip.imageUrl = req.file.path;
        }
      }

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404).json({ message: "Trip not found" });
    }
  } catch (error) {
    console.error("updateTrip error", error);
    res
      .status(500)
      .json({ message: "Error updating trip", error: error.message });
  }
};


export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      await trip.deleteOne();
      res.json({ message: "Trip removed" });
    } else {
      res.status(404).json({ message: "Trip not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting trip", error: error.message });
  }
};


export const getTripBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({ trip: req.params.id }).populate(
      "user",
      "name email"
    );

    if (!bookings) {
      return res
        .status(404)
        .json({ message: "No bookings found for this trip" });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};