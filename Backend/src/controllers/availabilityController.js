import Availability from '../models/Availability.js';

/**
 * Get user's availability for all days
 */
export const getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({ user: req.user._id }).sort({ dayOfWeek: 1 });

    // If no availability set, return default (9 AM - 5 PM for weekdays)
    if (availability.length === 0) {
      const defaultAvailability = [];
      for (let day = 1; day <= 5; day++) { // Monday to Friday
        defaultAvailability.push({
          dayOfWeek: day,
          slots: [{ start: '09:00', end: '17:00' }],
          isDefault: true
        });
      }
      return res.status(200).json({
        success: true,
        data: defaultAvailability,
        message: 'Showing default availability'
      });
    }

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
};

/**
 * Set or update availability for a specific day
 */
export const setAvailability = async (req, res) => {
  try {
    const { dayOfWeek, slots } = req.body;

    // Validate day of week
    if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day of week (0-6, where 0 is Sunday)'
      });
    }

    // Validate slots
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Slots must be a non-empty array'
      });
    }

    // Validate slot format
    for (const slot of slots) {
      if (!slot.start || !slot.end) {
        return res.status(400).json({
          success: false,
          message: 'Each slot must have start and end time'
        });
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format. Use HH:MM (24-hour format)'
        });
      }

      // Validate end time is after start time
      if (slot.start >= slot.end) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
      }
    }

    // Find and update or create new
    let availability = await Availability.findOne({
      user: req.user._id,
      dayOfWeek
    });

    if (availability) {
      availability.slots = slots;
      await availability.save();
    } else {
      availability = await Availability.create({
        user: req.user._id,
        dayOfWeek,
        slots
      });
    }

    res.status(200).json({
      success: true,
      data: availability,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    console.error('Set availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set availability',
      error: error.message
    });
  }
};

/**
 * Update availability for multiple days at once
 */
export const bulkSetAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Availability must be an array'
      });
    }

    const results = [];

    for (const dayData of availability) {
      const { dayOfWeek, slots } = dayData;

      // Delete existing availability for this day
      await Availability.deleteMany({
        user: req.user._id,
        dayOfWeek
      });

      // Create new if slots provided
      if (slots && slots.length > 0) {
        const newAvailability = await Availability.create({
          user: req.user._id,
          dayOfWeek,
          slots
        });
        results.push(newAvailability);
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    console.error('Bulk set availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
};

/**
 * Delete availability for a specific day
 */
export const deleteAvailability = async (req, res) => {
  try {
    const { dayOfWeek } = req.params;

    await Availability.deleteMany({
      user: req.user._id,
      dayOfWeek: parseInt(dayOfWeek)
    });

    res.status(200).json({
      success: true,
      message: 'Availability deleted successfully'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete availability',
      error: error.message
    });
  }
};

/**
 * Get availability summary (for display)
 */
export const getAvailabilitySummary = async (req, res) => {
  try {
    const availability = await Availability.find({ user: req.user._id }).sort({ dayOfWeek: 1 });

    if (availability.length === 0) {
      return res.status(200).json({
        success: true,
        summary: 'Monday - Friday: 9:00 AM - 5:00 PM (Default)',
        hasCustomAvailability: false
      });
    }

    // Generate summary
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const summaryParts = [];

    availability.forEach(day => {
      const dayName = dayNames[day.dayOfWeek];
      const timeSlots = day.slots.map(slot => {
        const startFormatted = formatTime(slot.start);
        const endFormatted = formatTime(slot.end);
        return `${startFormatted} - ${endFormatted}`;
      }).join(', ');

      summaryParts.push(`${dayName}: ${timeSlots}`);
    });

    res.status(200).json({
      success: true,
      summary: summaryParts.join(' | '),
      hasCustomAvailability: true,
      details: availability
    });
  } catch (error) {
    console.error('Get availability summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability summary',
      error: error.message
    });
  }
};

// Helper function to format time
function formatTime(time) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

