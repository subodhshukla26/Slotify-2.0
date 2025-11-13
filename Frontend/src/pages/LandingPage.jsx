import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import DateTimeSelector from '../components/DateTimeSelector/DateTimeSelector'
import MeetingTypeSelection from '../components/MeetingTypeSelection/MeetingTypeSelection'

const LandingPage = () => {
  return (
    <div>
      <Navbar/>
      <div style={{ marginTop: "20px" }}></div>
      <MeetingTypeSelection/>
      <DateTimeSelector/>
    </div>
  )
}

export default LandingPage
