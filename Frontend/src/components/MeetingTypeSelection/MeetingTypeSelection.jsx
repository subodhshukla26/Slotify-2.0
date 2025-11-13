import React from 'react'
import './MeetingTypeSelection.css'

const MeetingTypeSelection = () => {

    const handleSelectMeeting = (meetingType) => {
     console.log(`Selected: ${meetingType}`);
     alert(`You Selected: ${meetingType}`);
    }


  return (
    <div className="container">
      <h1 className="title">Select a meeting type</h1> 
      <div className="meeting-options">
        {/*30 Minute Consultation*/}
        <div className="meeting-card">
            <div className="meeting-info">
                <h2 className="meeting-name">30 Minute Consultation</h2>
                <p className='meeting-description'>
                    Discuss your project requirements and how we can help.
                </p>
                <button 
                className="select-button"
                onClick={() => handleSelectMeeting('30 Minute Consultation')}
                >
                Select
                </button>
            </div>
            {/* <div className="illustration-container illustration-1">
              <div className="person person-left"></div>
              <div className="person person-right"></div>
            </div> */}
            <div className="custom-bg"></div>

        </div>
        {/*1 Hour Deep Dive*/}
        <div className="meeting-card">
          <div className="meeting-info">
            <h2 className="meeting-name">1 Hour Deep Dive</h2>
            <p className="meeting-description">In-depth discussion and planning for your project.</p>
            <button
            className="select-button"
            onClick={() => handleSelectMeeting('1 Hour Deep Dive')}
            >Select
            </button>
          </div>
          {/* <div className="illustration-container illustration-2">
            <div className="group">
              <div className="person-1"></div>
              <div className="person-2"></div>
              <div className="person-3"></div>
            </div>
          </div> */}
          <div className="custom-card-one"></div>

        </div>

        {/*Premium Consultation */}
          <div className="meeting-card">
            <div className="meeting-info">
              <h2 className='meeting-name'>Premium Consultation (Paid)</h2>
              <p className="meeting-description">Exclusive consultation with our lead consultant.Payment required</p>
              <button
              className='select-button'
              onClick={() =>  handleSelectMeeting('Premium Consultation (Paid)')}
              >
              Select
                </button>
            </div>
            {/* <div className="illustration-container illustration-3">
            <div className="consultation">
              <div className="person-left"></div>
              <div className="person-right"></div>
            </div>
          </div> */}
          <div className="custom-card-two"></div>
        </div> 
    </div>
    </div>
  )
}

export default MeetingTypeSelection
