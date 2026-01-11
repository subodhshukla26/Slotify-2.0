import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Notification from '../components/Notification/Notification'

const NotificationPage = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh' }}>
      <Navbar/>
      <Notification/>
    </div>
  )
}

export default NotificationPage
