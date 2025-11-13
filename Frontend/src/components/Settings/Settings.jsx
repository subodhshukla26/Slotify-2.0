import React, { useState } from 'react'
import './Settings.css';

const Settings = () => {
    const [isCalendarConnected, setIsCalendarConnected] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        timezone: '',
        duration: '60',
        bufferBefore: '15',
        bufferAfter: '15'
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const toggleCalendarConnection = () => {
    setIsCalendarConnected(!isCalendarConnected);
    };

    const paymentHistory = [
    {
      date: '2024-07-15',
      amount: '$50.00',
      description: 'Consultation Fee',
      status: 'Paid'
    },
    {
      date: '2024-06-20',
      amount: '$75.00',
      description: 'Workshop Fee',
      status: 'Paid'
    },
    {
      date: '2024-05-10',
      amount: '$25.00',
      description: 'Coaching Session',
      status: 'Paid'
    }
  ];

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
          />
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
        <div className="calendar-connection" onClick={toggleCalendarConnection}>
          <div className="calendar-info">
            <div className="calendar-icon">📅</div>
            <div className="calendar-details">
              <h4>Google Calendar</h4>
              <div className={`calendar-status ${!isCalendarConnected ? 'disconnected' : ''}`}>
                {isCalendarConnected ? 'Connected' : 'Disconnected'}
              </div>
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
          
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, index) => (
                <tr key={index}>
                  <td className="payment-date">{payment.date}</td>
                  <td className="payment-amount">{payment.amount}</td>
                  <td>{payment.description}</td>
                  <td>
                    <span className="status-badge status-paid">{payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Settings
