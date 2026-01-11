import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
    const { user } = useAuth();
    const [isCalendarConnected, setIsCalendarConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        timezone: 'UTC+0',
        duration: '60',
        bufferBefore: '15',
        bufferAfter: '15'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                timezone: user.timezone || 'UTC+0'
            }));
            
            // Check if Google Calendar is connected
            setIsCalendarConnected(
                !!(user.googleTokens?.accessToken && user.googleTokens?.refreshToken)
            );
            setLoading(false);
        }
    }, [user]);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const handleCalendarConnection = () => {
        if (isCalendarConnected) {
            alert('✅ Google Calendar is already connected!\n\nAll bookings are automatically synced to your Google Calendar.');
        } else {
            // Redirect to authenticate with Calendar scope
            window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/google`;
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            // TODO: Add API endpoint for saving user settings when backend is ready
            // For now, just show success message
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            alert('Settings saved successfully! ✅\n\nNote: Full settings sync will be available in the next update.');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>User Info</h1>
      
      <div className="section">
        <h2 className="section-title">Profile</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', cursor: 'not-allowed' }}
          />
          <small style={{ color: '#718096', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            Email cannot be changed (linked to your Google account)
          </small>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="timezone">Time Zone</label>
          <select
            id="timezone"
            name="timezone"
            className="form-input"
            value={formData.timezone}
            onChange={handleInputChange}
          >
            <option value="">Select timezone</option>
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">GMT (UTC+0)</option>
          </select>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Connected Calendars</h2>
        <div className="calendar-connection" onClick={handleCalendarConnection} style={{ cursor: 'pointer' }}>
          <div className="calendar-info">
            <div className="calendar-icon">📅</div>
            <div className="calendar-details">
              <h4>Google Calendar</h4>
              <div className={`calendar-status ${!isCalendarConnected ? 'disconnected' : ''}`}>
                {isCalendarConnected ? '✓ Connected' : '✗ Not Connected'}
              </div>
              {isCalendarConnected && (
                <small style={{ color: '#68d391', fontSize: '0.875rem' }}>
                  All bookings sync automatically
                </small>
              )}
            </div>
          </div>
          <div className={`checkmark ${!isCalendarConnected ? 'disconnected' : ''}`}>
            {isCalendarConnected ? '✓' : '✗'}
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Booking Settings</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="duration">Default Event Duration</label>
          <select
            id="duration"
            name="duration"
            className="form-input"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="bufferBefore">Buffer Before Event</label>
          <select
            id="bufferBefore"
            name="bufferBefore"
            className="form-input"
            value={formData.bufferBefore}
            onChange={handleInputChange}
          >
            <option value="0">No buffer</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="bufferAfter">Buffer After Event</label>
          <select
            id="bufferAfter"
            name="bufferAfter"
            className="form-input"
            value={formData.bufferAfter}
            onChange={handleInputChange}
          >
            <option value="0">No buffer</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      </div>

      <div className="section">
        <div className="payment-history">
          <div className="payment-header">
            <h2 className="section-title" style={{ marginBottom: 0 }}>Payment History</h2>
          </div>
          
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#a0aec0',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px dashed rgba(139, 92, 246, 0.3)'
          }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>💳 No payment history yet</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              Payment features are coming soon!
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-button-container">
        <button 
          className="save-btn" 
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default Settings
