import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Appointment from '../components/Appointment/Appointment'

const AppointmentPage = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh' }}>
      <Navbar/>
      <Appointment/>
    </div>
  )
}

export default AppointmentPage

