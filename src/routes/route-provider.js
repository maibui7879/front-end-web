"use client"

import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import AppLayout from "../layouts/AppLayout"
import { AuthRoutes, AppRoutes } from "./index"

const RouteProvider = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const isAuthPage = location.pathname === "/"

  useEffect(() => {
    if (!token && location.pathname !== "/") {
      navigate("/", { replace: true })
    }
  }, [token, location.pathname, navigate])

  if (isAuthPage) {
    return <AuthRoutes />
  }

  return (
    <AppLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
      <AppRoutes />
    </AppLayout>
  )
}

export default RouteProvider
