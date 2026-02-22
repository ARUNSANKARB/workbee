import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingDetails,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
  startBooking,
} from '../controllers/bookings.js';
import { protect } from '../middleware/auth.js';
import { validateBooking, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All booking routes are protected
router.use(protect);

// Create booking
router.post('/', validateBooking, handleValidationErrors, createBooking);

// Get bookings
router.get('/', getUserBookings);
router.get('/:id', getBookingDetails);

// Booking actions
router.put('/:id/accept', acceptBooking);
router.put('/:id/reject', rejectBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/start', startBooking);
router.put('/:id/complete', completeBooking);

export default router;
