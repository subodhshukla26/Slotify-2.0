import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Settings from '../components/Settings/Settings'

const SettingsPage = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh' }}>
      <Navbar/>
      <Settings/>
    </div>
  )
}

export default SettingsPage
