import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { getMyAvailability, bulkSetAvailability } from '../../services/api';
import './AvailabilityEditor.css';

const AvailabilityEditor = ({ isOpen, onClose, onSave }) => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (isOpen) {
      loadAvailability();
    }
  }, [isOpen]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyAvailability();
      
      // Initialize all days with empty slots
      const allDays = dayNames.map((_, index) => ({
        dayOfWeek: index,
        enabled: false,
        slots: []
      }));

      // Populate with existing availability
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(day => {
          if (!day.isDefault) {
            allDays[day.dayOfWeek] = {
              dayOfWeek: day.dayOfWeek,
              enabled: true,
              slots: day.slots || []
            };
          } else {
            // Default availability
            allDays[day.dayOfWeek] = {
              dayOfWeek: day.dayOfWeek,
              enabled: true,
              slots: day.slots || []
            };
          }
        });
      }

      setAvailability(allDays);
    } catch (err) {
      setError(err.message || 'Failed to load availability');
      console.error('Load availability error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayIndex) => {
    const newAvailability = [...availability];
    const day = newAvailability[dayIndex];
    
    if (day.enabled) {
      day.enabled = false;
      day.slots = [];
    } else {
      day.enabled = true;
      day.slots = [{ start: '09:00', end: '17:00' }];
    }
    
    setAvailability(newAvailability);
  };

  const addSlot = (dayIndex) => {
    const newAvailability = [...availability];
    const day = newAvailability[dayIndex];
    
    // Get the end time of the last slot, or start at 09:00
    const lastSlot = day.slots[day.slots.length - 1];
    const newStart = lastSlot ? lastSlot.end : '09:00';
    const newEnd = lastSlot ? addHours(lastSlot.end, 1) : '17:00';
    
    day.slots.push({ start: newStart, end: newEnd });
    setAvailability(newAvailability);
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.splice(slotIndex, 1);
    
    // If no slots left, disable the day
    if (newAvailability[dayIndex].slots.length === 0) {
      newAvailability[dayIndex].enabled = false;
    }
    
    setAvailability(newAvailability);
  };

  const updateSlot = (dayIndex, slotIndex, field, value) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots[slotIndex][field] = value;
    setAvailability(newAvailability);
  };

  const addHours = (time, hours) => {
    const [h, m] = time.split(':').map(Number);
    let newHour = h + hours;
    if (newHour >= 24) newHour = 23;
    return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // Validate all slots
      for (const day of availability) {
        if (day.enabled) {
          for (const slot of day.slots) {
            if (slot.start >= slot.end) {
              setError(`Invalid time slot on ${dayNames[day.dayOfWeek]}: End time must be after start time`);
              return;
            }
          }
        }
      }

      // Prepare data for bulk update
      const availabilityData = availability
        .filter(day => day.enabled && day.slots.length > 0)
        .map(day => ({
          dayOfWeek: day.dayOfWeek,
          slots: day.slots
        }));

      // Also include disabled days (with empty slots) to clear them
      availability.forEach(day => {
        if (!day.enabled) {
          availabilityData.push({
            dayOfWeek: day.dayOfWeek,
            slots: []
          });
        }
      });

      await bulkSetAvailability(availabilityData);
      
      if (onSave) {
        onSave();
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save availability');
      console.error('Save availability error:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyToAllDays = (dayIndex) => {
    const sourceDaySlots = availability[dayIndex].slots;
    const newAvailability = availability.map((day, index) => {
      if (index === dayIndex) return day;
      
      return {
        ...day,
        enabled: true,
        slots: JSON.parse(JSON.stringify(sourceDaySlots))
      };
    });
    
    setAvailability(newAvailability);
  };

  if (!isOpen) return null;

  return (
    <div className="availability-modal-overlay" onClick={onClose}>
      <div className="availability-modal" onClick={(e) => e.stopPropagation()}>
        <div className="availability-modal-header">
          <h2>Set Your Working Hours</h2>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {error && (
          <div className="availability-error">
            {error}
          </div>
        )}

        <div className="availability-modal-content">
          {loading ? (
            <div className="availability-loading">Loading availability...</div>
          ) : (
            <div className="availability-days">
              {availability.map((day, dayIndex) => (
                <div key={dayIndex} className={`availability-day ${day.enabled ? 'enabled' : 'disabled'}`}>
                  <div className="day-header">
                    <div className="day-name-toggle">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={() => toggleDay(dayIndex)}
                        className="day-checkbox"
                        id={`day-${dayIndex}`}
                      />
                      <label htmlFor={`day-${dayIndex}`} className="day-name">
                        {dayNames[dayIndex]}
                      </label>
                    </div>
                    {day.enabled && day.slots.length > 0 && (
                      <button
                        className="copy-btn"
                        onClick={() => copyToAllDays(dayIndex)}
                        title="Copy to all days"
                      >
                        Copy to all
                      </button>
                    )}
                  </div>

                  {day.enabled && (
                    <div className="day-slots">
                      {day.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-slot">
                          <div className="time-inputs">
                            <div className="time-input-group">
                              <Clock size={16} />
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateSlot(dayIndex, slotIndex, 'start', e.target.value)}
                                className="time-input"
                              />
                            </div>
                            <span className="time-separator">to</span>
                            <div className="time-input-group">
                              <Clock size={16} />
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateSlot(dayIndex, slotIndex, 'end', e.target.value)}
                                className="time-input"
                              />
                            </div>
                          </div>
                          {day.slots.length > 1 && (
                            <button
                              className="remove-slot-btn"
                              onClick={() => removeSlot(dayIndex, slotIndex)}
                              title="Remove time slot"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button className="add-slot-btn" onClick={() => addSlot(dayIndex)}>
                        <Plus size={16} />
                        Add time slot
                      </button>
                    </div>
                  )}

                  {!day.enabled && (
                    <div className="day-unavailable">Unavailable</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="availability-modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityEditor;

