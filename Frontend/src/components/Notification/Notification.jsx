import { Mail, Clock, Phone } from 'lucide-react';
import React, { useState } from 'react'
import './Notification.css'
const Notification = () => {
    
    const [settings, setSettings] = useState(
    {
    HostNotification: false,
    InviteeNotification: false,
    EmailRemainders: false,
    SMSRemainders: false,
    cancellationWindow:''
    });

    const handleToggleBar = (Setting) =>{
        setSettings(prev => ({
            ...prev,
            [Setting] : !prev[Setting]
        }))
    }
    const handleCancellationWindowChange = (e) => {
        setSettings(prev => ({
            ...prev,
            cancellationWindow: e.target.value
        }))
    }

    const handleSaveChanges = () =>{
    console.log('Saving settings:', Settings);
    alert('Settings saved successfully!');
   }

  return (
     <div className="notifications">
     <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-description">
            Manage email and SMS notifications for you and your invitees. Customize settings for confirmations, reminders, and cancellations.
          </p>
        </div>
         
          <section>
          <h2 className="section-header">Event Notifications</h2>
            <div className="notification-item">
            <div className="notification-content">
              <div className="notification-icon">
                <Mail />
              </div>
              <div className="notification-details">
                <h3 className="notification-title">Host Notifications</h3>
                <p className="notification-subtitle">
                  Email notifications sent to you when an event is scheduled, rescheduled, or canceled.
                </p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.inviteeNotifications}
                onChange={() => handleToggle('inviteeNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          </section>

           <section>
          <h2 className="section-header">Reminder Notifications</h2>
          
          {/* Email Reminders */}
          <div className="notification-item">
            <div className="notification-content">
              <div className="notification-icon">
                <Clock />
              </div>
              <div className="notification-details">
                <h3 className="notification-title">Email Reminders</h3>
                <p className="notification-subtitle">
                  Send email reminders to invitees before their scheduled event.
                </p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailReminders}
                onChange={() => handleToggle('emailReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* SMS Reminders */}
          <div className="notification-item">
            <div className="notification-content">
              <div className="notification-icon">
                <Phone />
              </div>
              <div className="notification-details">
                <h3 className="notification-title">SMS Reminders</h3>
                <p className="notification-subtitle">
                  Send SMS reminders to invitees before their scheduled event.
                </p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.smsReminders}
                onChange={() => handleToggle('smsReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>
        
        {/* Cancellation Policy Section */}
        <section className="cancellation-policy">
          <h2 className="section-header">Cancellation Policy</h2>
          
          <div className="cancellation-window-group">
            <label htmlFor="cancellationWindow" className="cancellation-label">
              Cancellation Window
            </label>
            <select
              id="cancellationWindow"
              value={settings.cancellationWindow}
              onChange={handleCancellationWindowChange}
              className="cancellation-select"
            >
              <option value="">Select cancellation window</option>
              <option value="no-restriction">No restriction</option>
              <option value="1-hour">1 hour before</option>
              <option value="2-hours">2 hours before</option>
              <option value="4-hours">4 hours before</option>
              <option value="8-hours">8 hours before</option>
              <option value="12-hours">12 hours before</option>
              <option value="24-hours">24 hours before</option>
              <option value="48-hours">48 hours before</option>
              <option value="72-hours">72 hours before</option>
              <option value="1-week">1 week before</option>
            </select>
          </div>
        </section>

         {/* Save Button */}
        <div className="save-button-container">
          <button onClick={handleSaveChanges} className="save-btn">
            Save Changes
          </button>
        </div>
        </div>
        </div>
  )
}

export default Notification
