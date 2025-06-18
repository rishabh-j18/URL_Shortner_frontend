"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import QRCode from "react-qr-code"; // Updated import for react-qr-code
import AppLayout from "../components/AppLayout";
import { linkService } from "../services/linkService";

function CreateLinkPage() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [useCustomAlias, setUseCustomAlias] = useState(false);
  const [useExpiration, setUseExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate URL
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch (err) {
      setError("Please enter a valid URL");
      return;
    }

    // Validate custom alias if enabled
    if (useCustomAlias && !customAlias) {
      setError("Please enter a custom alias or disable the option");
      return;
    }

    // Validate expiration date if enabled
    if (useExpiration && !expirationDate) {
      setError("Please select an expiration date or disable the option");
      return;
    }

    const selectedDate = new Date(expirationDate);
    if (useExpiration && selectedDate < new Date()) {
      setError("Expiration date cannot be in the past");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await linkService.createLink({
        originalUrl: url,
        customAlias: useCustomAlias ? customAlias : undefined,
        expirationDate: useExpiration ? expirationDate : undefined,
      });
      if (result.status === 201) {
        setShortUrl(result.data.shortUrl || "");
        setSuccess(true);
      } else {
        setError(result.message?.message||result.message || "Failed to create short URL")
        setSuccess(false);
      }
    } catch (err) {
      setError(err.message || "Failed to create short URL. Please try again.");
      console.error("Error creating short URL:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  const resetForm = () => {
    setSuccess(false);
    setUrl("");
    setCustomAlias("");
    setUseCustomAlias(false);
    setUseExpiration(false);
    setExpirationDate("");
    setShortUrl("");
    setShowQR(false);
  };

  return (
    <AppLayout title="Create Link">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              {!success ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <Typography variant="h5" gutterBottom>
                    Shorten a URL
                  </Typography>

                  <TextField
                    fullWidth
                    label="URL to shorten"
                    variant="outlined"
                    margin="normal"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url"
                    error={!!error && !url}
                    helperText={!url && error ? error : ""}
                  />

                  <Box sx={{ mt: 3, mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useCustomAlias}
                          onChange={(e) => setUseCustomAlias(e.target.checked)}
                        />
                      }
                      label="Use custom alias"
                    />
                  </Box>

                  {useCustomAlias && (
                    <TextField
                      fullWidth
                      label="Custom alias"
                      variant="outlined"
                      margin="normal"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="my-custom-link"
                      error={!!error && useCustomAlias && !customAlias}
                      helperText={
                        useCustomAlias && !customAlias && error ? error : ""
                      }
                    />
                  )}

                  <Box sx={{ mt: 3, mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useExpiration}
                          onChange={(e) => setUseExpiration(e.target.checked)}
                        />
                      }
                      label="Set expiration date"
                    />
                  </Box>

                  {useExpiration && (
                    <TextField
                      fullWidth
                      label="Expiration date"
                      type="date"
                      margin="normal"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                      error={!!error && useExpiration && !expirationDate}
                      helperText={
                        useExpiration && !expirationDate && error ? error : ""
                      }
                    />
                  )}

                  {error &&
                    !error.includes("Please enter") && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}

                  <Box
                    sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                      sx={{ minWidth: 120 }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Create Link"}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h5" gutterBottom>
                    Your Short Link is Ready!
                  </Typography>

                  <Card sx={{ mt: 3, mb: 3 }}>
                    <CardContent>
                      <Typography
                        variant="body1"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {shortUrl}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CopyIcon />}
                        onClick={handleCopyLink}
                      >
                        {copied ? "Copied!" : "Copy Link"}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<QrCodeIcon />}
                        onClick={toggleQRCode}
                      >
                        {showQR ? "Hide QR Code" : "Show QR Code"}
                      </Button>
                    </Grid>
                  </Grid>

                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          mt: 4,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Paper elevation={3} sx={{ p: 3 }}>
                          <QRCode
                            value={shortUrl}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="L" // Error correction level: L, M, Q, H
                          />
                        </Paper>
                      </Box>
                    </motion.div>
                  )}

                  <Divider sx={{ my: 4 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                    <Button variant="contained" onClick={resetForm}>
                      Create Another Link
                    </Button>
                  </Box>
                </motion.div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default CreateLinkPage;
