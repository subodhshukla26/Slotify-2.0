import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/api';
import './Appointment.css'

const Appointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    appointmentName: '',
    description: '',
    Color: '#3b82f6',
    duration: '30'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.appointmentName || !formData.duration) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        title: formData.appointmentName,
        description: formData.description,
        duration: parseInt(formData.duration),
        color: formData.Color
      };

      const response = await createEvent(eventData);
      
      if (response.success) {
        alert('Event created successfully! ✅');
        // Reset form
        setFormData({
          appointmentName: '',
          description: '',
          Color: '#3b82f6',
          duration: '30'
        });
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="new-event-type">
        <div className="form-container">
            <div className="form-header">
           <h1 className="form-container-title">New Appointment</h1>
           <p className="form-container-paragraph">What kind of event is this?</p>
             </div>
            
            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#991b1b',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="appointmentName" className="form-label">
                  Appointment name
                </label>
            <input
            type="text"
            id="appointmentName"
            name="appointmentName"
            value={formData.appointmentName}
            onChange={handleInputChange}
            placeholder="eg. 30-min consultation"
            className="form-input"
            />
            </div>
            <div className="form-group">
                <label htmlFor="description" className="form-label">
                    Description/instructions
                </label>
             <input
             type='text'
             id='description'
             name='description'
             value={formData.description}
             onChange={handleInputChange}
             placeholder='Provide Details about the event'
             className='form-textarea'
             />
            </div>

          <div className="form-group">
            <label htmlFor="Color" className="form-label">
               Color
            </label>
            <div className="color-picker-container">
              <div className="color-picker-display">
                <div className="color-preview" style={{ backgroundColor: formData.eventColor }}></div>
                <ChevronDown className="dropdown-arrow" />
              </div>
              <input
                type="color"
                id="Color"
                name="Color"
                value={formData.Color}
                onChange={handleInputChange}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />
            </div>
          </div>

          <h2 className="section-header">Event Details</h2>

          <div className="form-group">
            <label htmlFor="duration" className="form-label">
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select duration</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0, color: '#a78bfa', fontSize: '0.875rem' }}>
              💡 <strong>Tip:</strong> Your availability is set in the Dashboard. This event will respect those working hours.
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create event type'}
            </button>
          </div>
            </form>
        </div>
    </div>
  )
}

export default Appointment
