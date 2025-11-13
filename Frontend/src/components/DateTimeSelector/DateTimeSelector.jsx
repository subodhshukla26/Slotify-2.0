import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DateTimeSelector.css'

const DateTimeSelector = () => {
    const months = [
       'January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));    
    const [selectedDate, setSelectedDate] = useState(today.getDate());
    const [selectedTime, setSelectedTime] = useState('9:00 AM');
    const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);    
    
    const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM'];

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    //Used for Calculating number of days in a month.
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }
    //Used for FINDING weekday of the 1st of the month.
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
        setSelectedMonth(months[newDate.getMonth()]);
    }

    const renderCalendar = (monthOffset = 0) => {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() + monthOffset);

        const daysInMonth = getDaysInMonth(date);
        const firstDay = getFirstDayOfMonth(date);
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();

        const days = [];

        for (let i = 0; i < firstDay; i++)
        {
            days.push(<div key={`empty-${i}`} className="calendar-empty-cell"></div>)
        }
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++)
        {
         const isSelected = selectedDate === day && selectedMonth === monthName;
         days.push(
            <button
      key={day}
      onClick={() => {
        setSelectedDate(day);
        setSelectedMonth(monthName);
      }}
      className={`calendar-day ${isSelected ? 'selected' : ''}`}
    >
      {day}
    </button>
         );
        }
    return (
        <div className="calendar-month">
            <h3 className="month-title">
                {monthName}, {year}
            </h3>
            <div className="calendar-header">
  {daysOfWeek.map((day, index) => (
    <div key={`${day}-${index}`} className="day-header">  {/* ✅ index makes keys unique */}
      {day}
    </div>
  ))}
</div>
            <div className="calendar-grid">
                {days}
            </div>
        </div>
    )
    }
  return (
    <div className="date-time-selector">
        <h1 className="main-title">Select a Date & Time</h1>

        {/*Calendar Section*/}
         <div className="calendar-navigation">
            <button 
          onClick={() => navigateMonth(-1)}
          className="nav-button"
        >
          <ChevronLeft className="nav-icon" />
        </button>
        
        <div className="calendar-container">
          {renderCalendar(0)}
          {/* {renderCalendar(1)} */}
        </div>
        
        <button 
          onClick={() => navigateMonth(1)}
          className="nav-button"
        >
          <ChevronRight className="nav-icon" />
        </button>
    </div>

    {/*Time Selection Section*/}
     <div className="time-section">
      <h2 className="time-title">Available Times</h2>
      <div className="time-slots">
        {availableTimes.map(time => (
            <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
            >
             {time}
            </button>
        ))}
      </div>
     </div>


    </div>
  )
}

export default DateTimeSelector
