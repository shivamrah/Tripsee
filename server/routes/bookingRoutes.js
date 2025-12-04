import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
// Client expects `/bookings/mybookings` in some places; provide both aliases
router.get('/my', protect, getUserBookings);
router.get('/mybookings', protect, getUserBookings);
// Admin: provide a clear alias `/all` and base `/` for fetching all bookings
router.get('/all', protect, admin, getAllBookings);
router.get('/', protect, admin, getAllBookings);

// Admin actions on individual bookings
router.put('/:id', protect, admin, updateBooking);

router.delete('/:id', protect, admin, deleteBooking);

export default router;
