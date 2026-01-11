import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== EVENT APIs ==========

/**
 * Create a new event
 */
export const createEvent = async (eventData) => {
  const response = await api.post('/api/events', eventData);
  return response.data;
};

/**
 * Get all user events
 */
export const getMyEvents = async () => {
  const response = await api.get('/api/events');
  return response.data;
};

/**
 * Get a specific event by ID
 */
export const getEventById = async (eventId) => {
  const response = await api.get(`/api/events/${eventId}`);
  return response.data;
};

/**
 * Get public event details (for booking page)
 */
export const getPublicEvent = async (eventId) => {
  const response = await api.get(`/api/events/public/${eventId}`);
  return response.data;
};

/**
 * Update an event
 */
export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/api/events/${eventId}`, eventData);
  return response.data;
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/api/events/${eventId}`);
  return response.data;
};

// ========== BOOKING APIs ==========

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

/**
 * Get all bookings for authenticated user
 */
export const getMyBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const response = await api.get(`/api/bookings?${params.toString()}`);
  return response.data;
};

/**
 * Get a specific booking by ID
 */
 
export const getBookingById = async (bookingId) => {
  const response = await api.get(`/api/bookings/${bookingId}`);
  return response.data;
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/api/bookings/${bookingId}/cancel`);
  return response.data;
};

/**
 * Get available time slots for an event
 */
export const getAvailableSlots = async (eventId, date) => {
  const response = await api.get(`/api/bookings/available-slots/${eventId}?date=${date}`);
  return response.data;
};

// ========== AVAILABILITY APIs ==========

/**
 * Get user's availability for all days
 */
export const getMyAvailability = async () => {
  const response = await api.get('/api/availability');
  return response.data;
};

/**
 * Get availability summary
 */
export const getAvailabilitySummary = async () => {
  const response = await api.get('/api/availability/summary');
  return response.data;
};

/**
 * Set availability for a specific day
 */
export const setAvailability = async (dayOfWeek, slots) => {
  const response = await api.post('/api/availability', { dayOfWeek, slots });
  return response.data;
};

/**
 * Bulk update availability for multiple days
 */
export const bulkSetAvailability = async (availability) => {
  const response = await api.post('/api/availability/bulk', { availability });
  return response.data;
};

/**
 * Delete availability for a specific day
 */
export const deleteAvailability = async (dayOfWeek) => {
  const response = await api.delete(`/api/availability/${dayOfWeek}`);
  return response.data;
};

// ========== ERROR HANDLING ==========

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Something went wrong');
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw error;
    }
  }
);

export default api;

