"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import RouteProvider from "./routes/route-provider"
import 'antd/dist/reset.css'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateResponsive = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    updateResponsive()
    window.addEventListener("resize", updateResponsive)

    return () => window.removeEventListener("resize", updateResponsive)
  }, [])

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen(prev => !prev)
    }
  }

  return (
    <AuthProvider>
      <Router>
        <RouteProvider sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </Router>
    </AuthProvider>
  )
}

export default App
