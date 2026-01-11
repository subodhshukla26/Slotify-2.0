import express from 'express';
import {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getPublicEvent
} from '../controllers/eventController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/public/:id', getPublicEvent);

// Protected routes - require authentication
router.post('/', isAuthenticated, createEvent);
router.get('/', isAuthenticated, getMyEvents);
router.get('/:id', isAuthenticated, getEventById);
router.put('/:id', isAuthenticated, updateEvent);
router.delete('/:id', isAuthenticated, deleteEvent);

export default router;

