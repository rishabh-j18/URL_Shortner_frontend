"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // In a real app, validate token with backend
          // For demo, we'll just check if token exists
          const userData = { id: "1", email: "intern@dacoid.com" }
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const { token, user } = await authService.login(email, password)
      localStorage.setItem("token", token)
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
