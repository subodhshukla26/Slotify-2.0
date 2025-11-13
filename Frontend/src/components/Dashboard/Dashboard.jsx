import React from 'react';
import './Dashboard.css';
import { Clock } from 'lucide-react';


const Dashboard = () => {
  return (
    <>
    <div className="dashboard-ease">
      {/* Main Content */}
      <div className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <h2 className="page-title">Home</h2>
          <p className="page-description">Manage your upcoming appointments and availability.</p>
        </div>

        {/* Upcoming Section */}
        <div className="section">
          <h3 className="section-title">Upcoming</h3>
          
          {/* No Meetings Card */}
          <div className="no-meetings-card">
            <div className="custom-card">
            </div>
            
            <h4 className="no-meetings-title">No upcoming meetings</h4>
            <p className="no-meetings-description">
              You don't have any meetings scheduled for the next 7 days.
            </p>
            
            <button className="view-meetings-btn">
              View all meetings
            </button>
          </div>
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
                  <p>9:00 AM - 5:00 PM</p>
                </div>
              </div>
              <button className="edit-btn">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="section">
          <h3 className="section-title">Quick actions</h3>
          
          <div className="quick-actions">
            <button className="primary-btn">
              Create new event type
            </button>
            <button className="secondary-btn">
              Adjust availability
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
export default Dashboard;