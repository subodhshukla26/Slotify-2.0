import React, { useState, useEffect } from 'react'
import { Calendar, CreditCard, DollarSign, Video, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Integrations.css';

const Integrations = () => {
  const { user } = useAuth();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCalendarConnection();
  }, [user]);

  const checkCalendarConnection = () => {
    // Check if user has actual Google Calendar tokens
    if (user && user.googleTokens?.accessToken && user.googleTokens?.refreshToken) {
      setCalendarConnected(true);
    } else {
      setCalendarConnected(false);
    }
    setLoading(false);
  };

  const handleGoogleCalendarConnect = () => {
    if (calendarConnected) {
      alert('✅ Google Calendar is already connected!\n\nAll bookings are automatically synced to your Google Calendar.');
    } else {
      // Redirect to authenticate with Calendar scope
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/google`;
    }
  };

  const handleComingSoon = (serviceName) => {
    alert(`🚀 ${serviceName} integration is coming soon!\n\nWe're working hard to bring you more integrations.`);
  };
   

return (
    <div className="integrations">
      <div className="integrations-container">
        {/* Header */}
        <div className="integrations-header">
          <h1 className="integrations-title">Integrations</h1>
          <p className="integrations-description">
            Connect your favorite tools to streamline your scheduling process.
          </p>
        </div>

        {/* Calendar Section */}
        <section className="integration-section">
          <h2 className="section-header">Calendar</h2>
          
          <div className="integration-item">
            <div className="integration-content">
              <div className="integration-icon calendar-icon">
                <Calendar />
              </div>
              <div className="integration-details">
                <h3 className="integration-name">Google Calendar</h3>
                <p className="integration-description">
                  Sync your availability with your Google Calendar to avoid double bookings.
                </p>
                {calendarConnected && (
                  <p className="integration-status-text">
                    ✅ Active - All bookings sync automatically
                  </p>
                )}
              </div>
            </div>
            <button 
              className={`connect-btn ${calendarConnected ? 'connected' : ''}`}
              onClick={handleGoogleCalendarConnect}
            >
              {loading ? 'Loading...' : (calendarConnected ? 'Connected' : 'Connect')}
            </button>
          </div>
        </section>

        {/* Payments Section */}
        <section className="integration-section">
          <h2 className="section-header">Payments</h2>
          
          {/* Google Pay */}
          <div className="integration-item integration-item-disabled">
            <div className="integration-content">
              <div className="integration-icon stripe-icon"></div>
              <div className="integration-details">
                <h3 className="integration-name">
                  Google Pay
                  <span className="coming-soon-badge">Coming Soon</span>
                </h3>
                <p className="integration-description">
                  Accept payments for your events using Google Pay.
                </p>
              </div>
            </div>
            <button 
              className="connect-btn connect-btn-disabled"
              onClick={() => handleComingSoon('Google Pay')}
            >
              Coming Soon
            </button>
          </div>

          {/* Paytm */}
          <div className="integration-item integration-item-disabled">
            <div className="integration-content">
              <div className="integration-icon paypal-icon"></div>
              <div className="integration-details">
                <h3 className="integration-name">
                  Paytm
                  <span className="coming-soon-badge">Coming Soon</span>
                </h3>
                <p className="integration-description">
                  Receive payments through Paytm for your scheduled events.
                </p>
              </div>
            </div>
            <button 
              className="connect-btn connect-btn-disabled"
              onClick={() => handleComingSoon('Paytm')}
            >
              Coming Soon
            </button>
          </div>
        </section>

        {/* Video Conferencing Section */}
        <section className="integration-section">
          <h2 className="section-header">Video Conferencing</h2>
          
          {/* Zoom */}
          <div className="integration-item integration-item-disabled">
            <div className="integration-content">
              <div className="integration-icon zoom-icon">
                <Video />
              </div>
              <div className="integration-details">
                <h3 className="integration-name">
                  Zoom
                  <span className="coming-soon-badge">Coming Soon</span>
                </h3>
                <p className="integration-description">
                  Host virtual meetings with Zoom.
                </p>
              </div>
            </div>
            <button 
              className="connect-btn connect-btn-disabled"
              onClick={() => handleComingSoon('Zoom')}
            >
              Coming Soon
            </button>
          </div>

          {/* Microsoft Teams */}
          <div className="integration-item integration-item-disabled">
            <div className="integration-content">
              <div className="integration-icon teams-icon">
                <Users />
              </div>
              <div className="integration-details">
                <h3 className="integration-name">
                  Microsoft Teams
                  <span className="coming-soon-badge">Coming Soon</span>
                </h3>
                <p className="integration-description">
                  Conduct online meetings using Microsoft Teams.
                </p>
              </div>
            </div>
            <button 
              className="connect-btn connect-btn-disabled"
              onClick={() => handleComingSoon('Microsoft Teams')}
            >
              Coming Soon
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Integrations
