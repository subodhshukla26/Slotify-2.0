import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicEvent, createBooking, getAvailableSlots } from '../services/api';
import './BookingPage.css';

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [meetLink, setMeetLink] = useState('');

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchEventDetails = async () => {
    try {
      const response = await getPublicEvent(eventId);
      if (response.success) {
        setEvent(response.data);
      }
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await getAvailableSlots(eventId, selectedDate);
      if (response.success) {
        setAvailableSlots(response.data);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Reset selected time
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.guestName || !formData.guestEmail || !selectedDate || !selectedTime) {
      setError('Please fill in all fields and select a time slot');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const slot = availableSlots.find(s => s.startTime === selectedTime);

      const bookingData = {
        eventId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        startTime: slot.startTime,
        endTime: slot.endTime
      };

      const response = await createBooking(bookingData);

      if (response.success) {
        setSuccess(true);
        if (response.data && response.data.meetLink) {
          setMeetLink(response.data.meetLink);
        }
        // Redirecting is now manual or longer so they can see the link
      }
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-page-loading">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="booking-page-error">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="booking-page-success">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>A confirmation email has been sent to {formData.guestEmail}</p>

        {meetLink && (
          <div className="meet-link-container" style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '1rem', fontWeight: '500' }}>Your Google Meet link is ready:</p>
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#4F46E5',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Join Meeting Now
            </a>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
              You can also find this link in your email invitation.
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '2rem',
            background: 'none',
            border: 'none',
            color: '#4F46E5',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Return to home
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <img
            src={event.user.avatar || 'https://via.placeholder.com/80'}
            alt={event.user.name}
            className="host-avatar"
          />
          <h1>{event.user.name}</h1>
          <h2>{event.title}</h2>
          <p className="event-duration">⏱️ {event.duration} minutes</p>
          {event.description && (
            <p className="event-description">{event.description}</p>
          )}
        </div>

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-section">
            <h3>Your Information</h3>

            <div className="form-group">
              <label htmlFor="guestName">Name *</label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                value={formData.guestName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="guestEmail">Email *</label>
              <input
                type="email"
                id="guestEmail"
                name="guestEmail"
                value={formData.guestEmail}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Select Date & Time</h3>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {selectedDate && (
              <div className="form-group">
                <label>Available Time Slots</label>
                {loadingSlots ? (
                  <p>Loading available slots...</p>
                ) : (
                  <div className="time-slots">
                    {availableSlots.filter(slot => slot.available).length === 0 ? (
                      <p className="no-slots">No available slots for this date</p>
                    ) : (
                      availableSlots
                        .filter(slot => slot.available)
                        .map((slot) => (
                          <button
                            key={slot.startTime}
                            type="button"
                            className={`time-slot ${selectedTime === slot.startTime ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(slot.startTime)}
                          >
                            {new Date(slot.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </button>
                        ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="booking-submit-btn"
            disabled={submitting || !selectedTime}
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;

