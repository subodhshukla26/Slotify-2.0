import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Integrations from '../components/Integrations/Integrations'

const IntegrationPage = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh' }}>
      <Navbar/>
      <Integrations/>
    </div>
  )
}

export default IntegrationPage
