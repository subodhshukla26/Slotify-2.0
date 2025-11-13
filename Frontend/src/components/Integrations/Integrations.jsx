import React, { useState } from 'react'
import { Calendar, CreditCard, DollarSign, Video, Users } from 'lucide-react';
import './Integrations.css';

const Integrations = () => {

    const [connectedServices, setConnectedServices] = useState({
    googleCalendar: false,
    googlepay: false,
    paytm: false,
    zoom: false,
    googleMeet: false
  });

   const handleConnect = (serviceName) => {
    // Simulate connection process
    setConnectedServices(prev => {
        const updated = {
      ...prev,
      [serviceName]: !prev[serviceName]
    };
     console.log(`${serviceName} ${updated[serviceName] ? 'connected' : 'disconnected'}`);
     return updated;

   });
      };

    const getButtonText = (serviceName) => {
    return connectedServices[serviceName] ? 'Connected' : 'Connect';
  };

  const getButtonClass = (serviceName) => {
    return `connect-btn ${connectedServices[serviceName] ? 'connected' : ''}`;
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
              </div>
            </div>
            <button 
              className={getButtonClass('googleCalendar')}
              onClick={() => handleConnect('googleCalendar')}
            >
              {getButtonText('googleCalendar')}
            </button>
          </div>
        </section>

        {/* Payments Section */}
        <section className="integration-section">
          <h2 className="section-header">Payments</h2>
          
          {/* Stripe */}
          <div className="integration-item">
            <div className="integration-content">
              {/* <div className="integration-icon stripe-icon">
                <CreditCard />
              </div> */}
              <div className="integration-icon stripe-icon"></div>

              <div className="integration-details">
                <h3 className="integration-name">Google Pay</h3>
                <p className="integration-description">
                  Accept payments for your events using Google Pay.
                </p>
              </div>
            </div>
            <button 
              className={getButtonClass('stripe')}
              onClick={() => handleConnect('stripe')}
            >
              {getButtonText('stripe')}
            </button>
          </div>

          {/* PayPal */}
          <div className="integration-item">
            <div className="integration-content">
              <div className="integration-icon paypal-icon">
                {/* <DollarSign /> */}
              </div>
              <div className="integration-details">
                <h3 className="integration-name">Paytm</h3>
                <p className="integration-description">
                  Receive payments through Paytm for your scheduled events.
                </p>
              </div>
            </div>
            <button 
              className={getButtonClass('paypal')}
              onClick={() => handleConnect('paypal')}
            >
              {getButtonText('paypal')}
            </button>
          </div>
        </section>

        {/* Video Conferencing Section */}
        <section className="integration-section">
          <h2 className="section-header">Video Conferencing</h2>
          
          {/* Zoom */}
          <div className="integration-item">
            <div className="integration-content">
              <div className="integration-icon zoom-icon">
                <Video />
              </div>
              <div className="integration-details">
                <h3 className="integration-name">Zoom</h3>
                <p className="integration-description">
                  Host virtual meetings with Zoom.
                </p>
              </div>
            </div>
            <button 
              className={getButtonClass('zoom')}
              onClick={() => handleConnect('zoom')}
            >
              {getButtonText('zoom')}
            </button>
          </div>

          {/* Microsoft Teams */}
          <div className="integration-item">
            <div className="integration-content">
              <div className="integration-icon teams-icon">
                <Users />
              </div>
              <div className="integration-details">
                <h3 className="integration-name">Microsoft Teams</h3>
                <p className="integration-description">
                  Conduct online meetings using Microsoft Teams.
                </p>
              </div>
            </div>
            <button 
              className={getButtonClass('microsoftTeams')}
              onClick={() => handleConnect('microsoftTeams')}
            >
              {getButtonText('microsoftTeams')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Integrations
