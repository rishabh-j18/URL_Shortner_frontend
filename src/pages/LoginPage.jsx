"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from "@mui/icons-material"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/authService"  // Import backend authentication service

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()  // Assuming the context exists for additional functionality
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")  // Reset error state
    setLoading(true)

    try {
      // Replace mock logic with actual backend API call
      const result = await login(email, password)  // Call backend login API
      if (result.token) {
        localStorage.setItem("token", result.token)  // Store JWT token in localStorage
        navigate("/dashboard")  // Redirect to the dashboard
      }
    } catch (err) {
      setError("Login failed. Please try again.")  // Show error if login fails
      console.error("Login error:", err)
    } finally {
      setLoading(false)  // Reset loading state
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)  // Toggle password visibility
  }

  return (
    <Container component="main" maxWidth="xs">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Use: intern@dacoid.com / Test123  {/* Example for testing, remove in production */}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default LoginPage
