import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { useState } from 'react'

const MainLayout = () => {
  const [isOpen, setisOpen] = useState(false)
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar className="w-64 h-full" isOpen={isOpen} onMenuClick={() => setisOpen(!isOpen)} />
      {/* flex-1:  take remaining width */}
      <div className="flex-1 flex flex-col overflow-hidden"> 
        <Header isOpen={isOpen} onMenuClick={() => setisOpen(!isOpen)} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainLayout