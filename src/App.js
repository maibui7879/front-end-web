"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import RouteProvider from "./routes/route-provider"
import 'antd/dist/reset.css';
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true)
        setSidebarOpen(false)
      } else {
        setIsMobile(false)
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen(!sidebarOpen)
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
