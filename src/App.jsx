"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { CssBaseline } from "@mui/material"
import { useAuth } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import CreateLinkPage from "./pages/CreateLinkPage"
import RedirectPage from "./pages/RedirectPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={isAuthenticated ? <DashboardPage/> : <LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateLinkPage />
            </ProtectedRoute>
          }
        />
        <Route path="/:shortCode" element={<RedirectPage />} />
      </Routes>
    </>
  )
}

export default App
