"use client"

import { useContext } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

// Pages
import TeamPage from "../pages/Teams/TeamPage"
import Profile from "../pages/Users/Profile"
import HomePage from "../pages/HomePage"
import AuthPage from "../pages/Users/AuthPage"
import CreateProfilePage from "../pages/Users/CreateProfilePage"
import TeamDetailPage from "../pages/Teams/TeamDetailPage"
import ProfileId from "../pages/Users/ProfileId"
import CalendarPage from "../pages/CalendarPage"
import PersonalTasksPage from "../pages/PersonalTasksPage"
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
    </Routes>
  )
}

// App routes - with layout
export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <TeamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:id"
        element={
          <ProtectedRoute>
            <TeamDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal-tasks"
        element={
          <ProtectedRoute>
            <PersonalTasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route path="/create-profile" element={<CreateProfilePage />} />
      <Route path="/profile/:id" element={<ProfileId />} />
    </Routes>
  )
}
