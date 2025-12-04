import express from 'express';
import upload from '../config/cloudinaryConfig.js';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripBookings,
} from '../controllers/tripController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTrips);
router.get('/:id', getTripById);
router.post('/', protect, admin, upload.single('image'), createTrip);
router.put('/:id', protect, admin, updateTrip);
router.delete('/:id', protect, admin, deleteTrip);
router.get('/:id/bookings', protect, admin, getTripBookings);

export default router;
