import React from 'react'
import Navbar from './components/Navbar/Navbar'
import MeetingTypeSelection from './components/MeetingTypeSelection/MeetingTypeSelection'
import DateTimeSelector from './components/DateTimeSelector/DateTimeSelector'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import Appointment from './components/Appointment/Appointment'
import AppointmentPage from './pages/AppointmentPage'
import NotificationPage from './pages/NotificationPage'
import SettingsPage from './pages/SettingsPage'
import IntegrationPage from './pages/IntegrationPage'




const App = () => {
  return (
    // <div>
    //   <Navbar/>
    //   <div style={{ marginTop: "20px" }}></div>
    //   <MeetingTypeSelection/>
    //   <DateTimeSelector/>
      
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/appointment" element={<AppointmentPage/>} />
        <Route path="/notification" element={<NotificationPage/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/integration" element={<IntegrationPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
