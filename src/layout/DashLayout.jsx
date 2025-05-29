import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const DashLayout = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      {/* Add top padding equal to Navbar height so content is not hidden */}
      <div className="pt-24"> 
        <Outlet />
      </div>
    </div>
  )
}

export default DashLayout
