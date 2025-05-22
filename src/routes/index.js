"use client"

import { useContext } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

// Pages
import HomePage from "../pages/HomePage"
import TeamPage from "../pages/TeamPage"
import Profile from "../pages/Profile"
import PersonalTasksPage from "../pages/PersonalTasksPage"
import AuthPage from "../pages/AuthPage"
import CreateProfilePage from "../pages/CreateProfilePage"
import TeamDetailPage from "../pages/TeamDetailPage"
import ProfileId from "../pages/ProfileId"
import TestToast from "../TestToast"
// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// Auth routes - full page without layout
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
        path="/test-toast"
        element={
          <ProtectedRoute>
            <TestToast />
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
      <Route path="/create-profile" element={<CreateProfilePage />} />
      <Route path="/profile/:id" element={<ProfileId />} />
    </Routes>
  )
}
