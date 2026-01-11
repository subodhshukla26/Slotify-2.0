import Event from '../models/Event.js';

/**
 * Create a new event type
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, duration, color } = req.body;

    if (!title || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Title and duration are required'
      });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      description,
      duration,
      color: color || '#3b82f6'
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

/**
 * Get all events for the logged-in user
 */
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate('user', 'name email avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

/**
 * Update an event
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, color } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Update fields
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (duration) event.duration = duration;
    if (color) event.color = color;

    await event.save();

    res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

/**
 * Get public event details (for booking page)
 */
export const getPublicEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate('user', 'name email avatar timezone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get public event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

