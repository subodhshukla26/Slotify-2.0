import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Clock, Calendar, Link as LinkIcon, Copy, CheckCircle, Video } from 'lucide-react';
import { getMyEvents, getMyBookings, getAvailabilitySummary } from '../../services/api';
import AvailabilityEditor from '../AvailabilityEditor/AvailabilityEditor';


const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedEventId, setCopiedEventId] = useState(null);
  const [availabilitySummary, setAvailabilitySummary] = useState('Monday - Friday: 9:00 AM - 5:00 PM');
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAvailability();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        getMyEvents(),
        getMyBookings({ status: 'scheduled' })
      ]);

      if (eventsRes.success) {
        setEvents(eventsRes.data);
      }
      if (bookingsRes.success) {
        // Filter upcoming bookings only
        const upcoming = bookingsRes.data.filter(
          b => new Date(b.startTime) > new Date()
        );
        setBookings(upcoming);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await getAvailabilitySummary();
      if (response.success && response.summary) {
        setAvailabilitySummary(response.summary);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Keep default value if error
    }
  };

  const copyBookingLink = (eventId) => {
    const link = `${window.location.origin}/book/${eventId}`;
    navigator.clipboard.writeText(link);
    setCopiedEventId(eventId);
    setTimeout(() => setCopiedEventId(null), 2000);
  };

  const handleAvailabilitySaved = () => {
    fetchAvailability(); // Refresh the summary after saving
  };

  return (
    <>
      <div className="dashboard-ease">
        {/* Main Content */}
        <div className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <h2 className="page-title">Dashboard</h2>
            <p className="page-description">Manage your events, appointments and availability.</p>
          </div>

          {/* Events Section */}
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title">Your Event Types</h3>
              <Link to="/appointment" className="create-event-link">+ Create New</Link>
            </div>

            {loading ? (
              <div className="loading-state">Loading...</div>
            ) : events.length === 0 ? (
              <div className="no-meetings-card">
                <h4 className="no-meetings-title">No event types yet</h4>
                <p className="no-meetings-description">
                  Create an event type to start accepting bookings.
                </p>
                <Link to="/appointment">
                  <button className="view-meetings-btn">
                    Create Event Type
                  </button>
                </Link>
              </div>
            ) : (
              <div className="events-grid">
                {events.map(event => (
                  <div key={event._id} className="event-card">
                    <div className="event-color-bar" style={{ backgroundColor: event.color }}></div>
                    <h4>{event.title}</h4>
                    <p className="event-duration">⏱️ {event.duration} minutes</p>
                    {event.description && (
                      <p className="event-desc">{event.description}</p>
                    )}
                    <div className="event-actions">
                      <button
                        className="copy-link-btn"
                        onClick={() => copyBookingLink(event._id)}
                        title="Copy booking link"
                      >
                        {copiedEventId === event._id ? (
                          <><CheckCircle size={16} /> Copied!</>
                        ) : (
                          <><LinkIcon size={16} /> Copy Link</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Bookings Section */}
          <div className="section">
            <h3 className="section-title">Upcoming Bookings</h3>

            {loading ? (
              <div className="loading-state">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="no-meetings-card">
                <div className="custom-card"></div>

                <h4 className="no-meetings-title">No upcoming bookings</h4>
                <p className="no-meetings-description">
                  You don't have any meetings scheduled for the next 7 days.
                </p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking._id} className="booking-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="booking-icon">
                        <Calendar size={20} />
                      </div>
                      <div className="booking-details">
                        <h4>{booking.event.title}</h4>
                        <p>With {booking.guestName} ({booking.guestEmail})</p>
                        <p className="booking-time">
                          {new Date(booking.startTime).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {booking.meetLink && (
                      <a
                        href={booking.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="join-meeting-btn"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          backgroundColor: '#4F46E5',
                          color: 'white',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <Video size={16} /> Join
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="section">
            <h3 className="section-title">Availability</h3>

            <div className="availability-card">
              <div className="availability-content">
                <div className="availability-info">
                  <div className="availability-icon">
                    <Clock className="clock-icon" />
                  </div>
                  <div className="availability-details">
                    <h4>Working hours</h4>
                    <p>{availabilitySummary}</p>
                  </div>
                </div>
                <button className="edit-btn" onClick={() => setShowAvailabilityEditor(true)}>
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="section">
            <h3 className="section-title">Quick actions</h3>

            <div className="quick-actions">
              <Link to="/appointment">
                <button className="primary-btn">
                  Create new event type
                </button>
              </Link>
              <Link to="/settings">
                <button className="secondary-btn">
                  Manage Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Editor Modal */}
      <AvailabilityEditor
        isOpen={showAvailabilityEditor}
        onClose={() => setShowAvailabilityEditor(false)}
        onSave={handleAvailabilitySaved}
      />
    </>
  );
}
export default Dashboard;