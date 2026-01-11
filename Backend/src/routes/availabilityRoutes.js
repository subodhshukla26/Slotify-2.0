import express from 'express';
import {
  getMyAvailability,
  setAvailability,
  bulkSetAvailability,
  deleteAvailability,
  getAvailabilitySummary
} from '../controllers/availabilityController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/', isAuthenticated, getMyAvailability);
router.get('/summary', isAuthenticated, getAvailabilitySummary);
router.post('/', isAuthenticated, setAvailability);
router.post('/bulk', isAuthenticated, bulkSetAvailability);
router.delete('/:dayOfWeek', isAuthenticated, deleteAvailability);

export default router;

