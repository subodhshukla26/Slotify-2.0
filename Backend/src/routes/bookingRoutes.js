import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAvailableSlots
} from '../controllers/bookingController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createBooking); // Allow public booking creation
router.get('/available-slots/:eventId', getAvailableSlots);

// Protected routes - require authentication
router.get('/', isAuthenticated, getMyBookings);
router.get('/:id', isAuthenticated, getBookingById);
router.patch('/:id/cancel', isAuthenticated, cancelBooking);

export default router;

