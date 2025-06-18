"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CircularProgress, Typography, Container, Paper, Box } from "@mui/material"
import { motion } from "framer-motion"
import { linkService } from "../services/linkService"  // Import backend service for link resolution

function RedirectPage() {
  const { shortCode } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      try {
        const progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(progressInterval)
              return 100
            }
            return prevProgress + 5
          })
        }, 100)

        const result = await linkService.resolveLink(shortCode)  // Fetch link from backend
        console.log(result);
        setTimeout(() => {
          clearInterval(progressInterval)
          setProgress(100)

          window.location.href = result  // Redirect to original URL
        }, 1500)
      } catch (err) {
        console.error("Error redirecting:", err)
        setError(err.message || "This link is invalid or has expired.")
        setLoading(false)
      }
    }

    redirectToOriginalUrl()
  }, [shortCode])

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          {loading ? (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} variant="determinate" value={progress} />
              <Typography variant="h6">Redirecting you to your destination...</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Please wait while we log your visit and redirect you.
              </Typography>
              <Box sx={{ width: "100%", mt: 3 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  style={{
                    height: "4px",
                    backgroundColor: "#3f51b5",
                    borderRadius: "2px",
                  }}
                />
              </Box>
            </>
          ) : (
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          )}
        </Paper>
      </motion.div>
    </Container>
  )
}

export default RedirectPage
