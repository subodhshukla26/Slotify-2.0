import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Settings from '../components/Settings/Settings'

const SettingsPage = () => {
  return (
    <div>
      <Navbar/>
      <div style={{ marginTop: "20px" }}></div>
      <Settings/>
    </div>
  )
}

export default SettingsPage
