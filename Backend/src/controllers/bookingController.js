import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Availability from '../models/Availability.js';
import googleService from '../services/googleService.js';
import notificationService from '../services/notificationService.js';

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    const { eventId, guestName, guestEmail, startTime, endTime } = req.body;

    // Validate required fields
    if (!eventId || !guestName || !guestEmail || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: eventId, guestName, guestEmail, startTime, endTime'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    if (start < now) {
      return res.status(400).json({
        success: false,
        message: 'Booking time cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Get event details
    const event = await Event.findById(eventId).populate('user');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const host = event.user;

    // Check if time slot is available
    const isAvailable = await googleService.isTimeSlotAvailable(host._id, startTime, endTime);

    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is not available. Please choose another time.'
      });
    }

    // Create booking in database
    const booking = await Booking.create({
      event: eventId,
      user: host._id,
      guestName,
      guestEmail,
      startTime,
      endTime,
      status: 'scheduled'
    });

    // Create Google Calendar event
    let calendarEvent;
    try {
      calendarEvent = await googleService.createCalendarEvent(host._id, {
        summary: `${event.title} - ${guestName}`,
        description: `Booking with ${guestName} (${guestEmail})\n\nEvent: ${event.title}\n${event.description || ''}`,
        startTime,
        endTime,
        timeZone: host.timezone || 'UTC',
        attendees: [
          { email: guestEmail, displayName: guestName },
          { email: host.email, displayName: host.name }
        ],
        includeVideoConference: true
      });

      // Store calendar event ID and meeting link in booking
      booking.calendarEventId = calendarEvent.id;
      booking.meetLink = calendarEvent.hangoutLink;
      await booking.save();
    } catch (calendarError) {
      console.error('Calendar event creation failed:', calendarError);
      // Continue even if calendar creation fails
    }

    // Send notifications
    try {
      // Notify guest
      await notificationService.notifyGuestBookingConfirmed({
        guestName,
        guestEmail,
        eventTitle: event.title,
        startTime,
        endTime,
        hostName: host.name,
        hostEmail: host.email,
        meetLink: calendarEvent?.hangoutLink || null
      });

      // Notify host
      await notificationService.notifyHostNewBooking({
        guestName,
        guestEmail,
        eventTitle: event.title,
        startTime,
        endTime,
        hostName: host.name,
        hostEmail: host.email,
        meetLink: calendarEvent?.hangoutLink || null
      });
    } catch (notificationError) {
      console.error('Notification sending failed:', notificationError);
      // Continue even if notification fails
    }

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('event')
      .populate('user', 'name email avatar');

    res.status(201).json({
      success: true,
      data: {
        ...populatedBooking.toObject(),
        meetLink: calendarEvent?.hangoutLink || null
      },
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

/**
 * Get all bookings for the logged-in user (as host)
 */
export const getMyBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = { user: req.user._id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('event')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('event')
      .populate('user', 'name email avatar');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Delete from Google Calendar
    if (booking.calendarEventId) {
      try {
        await googleService.deleteCalendarEvent(booking.user._id, booking.calendarEventId);
      } catch (calendarError) {
        console.error('Calendar event deletion failed:', calendarError);
        // Continue even if calendar deletion fails
      }
    }

    // Send cancellation notifications
    try {
      const cancellationDetails = {
        guestName: booking.guestName,
        eventTitle: booking.event.title,
        startTime: booking.startTime,
        hostName: booking.user.name
      };

      // Notify guest
      await notificationService.notifyCancellation(
        cancellationDetails,
        booking.guestEmail,
        booking.user.name
      );

      // Notify host
      await notificationService.notifyCancellation(
        cancellationDetails,
        booking.user.email,
        booking.user.name
      );
    } catch (notificationError) {
      console.error('Cancellation notification failed:', notificationError);
      // Continue even if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

/**
 * Get available time slots for an event
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const event = await Event.findById(eventId).populate('user');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const host = event.user;

    // Get the selected date and determine day of week
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check if host has valid Google Calendar tokens
    const hasCalendarAccess = host.googleTokens?.accessToken && host.googleTokens?.refreshToken;

    // Load user's availability for this day
    const availability = await Availability.findOne({
      user: host._id,
      dayOfWeek
    });

    // If no availability set, use default (9 AM - 5 PM)
    const workingSlots = availability && availability.slots.length > 0
      ? availability.slots
      : [{ start: '09:00', end: '17:00' }];

    // Generate time slots based on working hours
    const slots = [];

    for (const workingSlot of workingSlots) {
      // Parse working hours
      const [startHour, startMinute] = workingSlot.start.split(':').map(Number);
      const [endHour, endMinute] = workingSlot.end.split(':').map(Number);

      // Convert to minutes for easier calculation
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      const durationMinutes = event.duration;

      // Generate slots within this working period
      for (let currentMinutes = startMinutes; currentMinutes + durationMinutes <= endMinutes; currentMinutes += 30) {
        const startTime = new Date(selectedDate);
        startTime.setHours(Math.floor(currentMinutes / 60), currentMinutes % 60, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);

        // Check if slot is available (default to true if no calendar access)
        let isAvailable = true;

        if (hasCalendarAccess) {
          try {
            isAvailable = await googleService.isTimeSlotAvailable(
              host._id,
              startTime.toISOString(),
              endTime.toISOString()
            );
          } catch (calendarError) {
            console.warn('Calendar availability check failed, defaulting to available:', calendarError.message);
            // Default to available if calendar check fails
            isAvailable = true;
          }
        }

        slots.push({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          available: isAvailable
        });
      }
    }

    res.status(200).json({
      success: true,
      data: slots,
      calendarConnected: hasCalendarAccess
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
};

