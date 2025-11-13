import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Appointment.css'

const Appointment = () => {

  const [formData, setFormData] = useState({
    appointmentName: '',
    description: '',
    location: '',
    eventLink: '',
    Color: '#3b82f6',
    calendar: '',
    duration: '',
    dateRange: '',
    price: '' 
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  }


  return (
    <div className="new-event-type">
        <div className="form-container">
            <div className="form-header">
           <h1 className="form-container-title">New Appointment</h1>
           <p className="form-container-paragraph">What kind of event is this?</p>
             </div>
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
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., In person, Phone call, Video conference"
              className="form-input"
            />
          </div>

            <div className="form-group">
            <label htmlFor="eventLink" className="form-label">
              Event link
            </label>
            <input
              type="text"
              id="eventLink"
              name="eventLink"
              value={formData.eventLink}
              onChange={handleInputChange}
              placeholder="e.g., consultation-30min"
              className="form-input"
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

          <h2 className="section-header">Availability</h2>

          <div className="form-group">
            <label htmlFor="calendar" className="form-label">
              Calendar
            </label>
            <select
              id="calendar"
              name="calendar"
              value={formData.calendar}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select calendar</option>
              <option value="primary">Primary Calendar</option>
              <option value="work">Work Calendar</option>
              <option value="personal">Personal Calendar</option>
            </select>
          </div>

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

             <div className="form-group">
            <label htmlFor="dateRange" className="form-label">
              Date range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={formData.dateRange}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select date range</option>
              <option value="7days">Next 7 days</option>
              <option value="14days">Next 14 days</option>
              <option value="30days">Next 30 days</option>
              <option value="60days">Next 60 days</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>

            <h2 className="section-header">Pricing</h2>


              <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <select
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select pricing</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="create-btn">
              Create event type
            </button>
          </div>
            </form>
        </div>
    </div>
  )
}

export default Appointment
