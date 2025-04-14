"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Chip,
  Grid,
  CircularProgress,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  QrCode as QrCodeIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { QRCodeSVG } from "qrcode.react";
import AppLayout from "../components/AppLayout";
import { linkService } from "../services/linkService";
import { useNavigate } from "react-router-dom";

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [expandedLinkId, setExpandedLinkId] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  // Fetch links with useCallback to prevent unnecessary re-renders
  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await linkService.getLinks();
      console.log(window.location.origin);
      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleLinkExpansion = (id) => {
    setExpandedLinkId(expandedLinkId === id ? null : id);
    if (showQRCode === id) {
      setShowQRCode(null);
    }
  };

  const toggleQRCode = (id, event) => {
    event.stopPropagation();
    setShowQRCode(showQRCode === id ? null : id);
  };

  // Filter links with memoized search term
  const filteredLinks = links.filter(
    (link) =>
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const paginatedLinks = filteredLinks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Truncate long labels for pie chart legends and labels
  const truncateLabel = (label, maxLength = 12) => {
    return label.length > maxLength
      ? `${label.slice(0, maxLength - 3)}...`
      : label;
  };

  return (
    <AppLayout title="Dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, maxWidth: 600 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search links..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "background.paper" }}
          />
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredLinks.length === 0 ? (
          <Paper
            sx={{ p: 4, textAlign: "center", bgcolor: "background.paper" }}
          >
            <Typography variant="h6" color="text.secondary">
              No links found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm
                ? "Try a different search term"
                : "Create your first short link"}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate("/create")}
            >
              Create Link
            </Button>
          </Paper>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{ bgcolor: "background.paper" }}
            >
              <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Short URL</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLinks.map((link) => (
                    <React.Fragment key={link.id}>
                      <TableRow
                        hover
                        onClick={() => toggleLinkExpansion(link.id)}
                        sx={{
                          cursor: "pointer",
                          "&.Mui-selected, &.Mui-selected:hover": {
                            backgroundColor: "action.selected",
                          },
                        }}
                        selected={expandedLinkId === link.id}
                      >
                        <TableCell
                          sx={{
                            maxWidth: { xs: 100, sm: 200 },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {link.originalUrl}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {link.shortUrl}
                            </Typography>
                            <Tooltip
                              title={
                                copiedId === link.id
                                  ? "Copied!"
                                  : "Copy to clipboard"
                              }
                            >
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyLink(link.id, link.shortUrl);
                                }}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{link.totalClicks}</TableCell>
                        <TableCell>
                          {new Date(link.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={link.isExpired ? "Expired" : "Active"}
                            color={link.isExpired ? "error" : "success"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Open link">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(link.shortUrl, "_blank");
                                }}
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Show QR code">
                              <IconButton
                                size="small"
                                onClick={(e) => toggleQRCode(link.id, e)}
                              >
                                <QrCodeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={
                                expandedLinkId === link.id
                                  ? "Hide analytics"
                                  : "Show analytics"
                              }
                            >
                              <IconButton size="small">
                                {expandedLinkId === link.id ? (
                                  <ExpandLessIcon fontSize="small" />
                                ) : (
                                  <ExpandMoreIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                          <Collapse
                            in={showQRCode === link.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                p: 2,
                              }}
                            >
                              <Paper
                                elevation={3}
                                sx={{
                                  p: 3,
                                  maxWidth: 250,
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="subtitle2" gutterBottom>
                                  QR Code
                                </Typography>
                                <QRCodeSVG value={link.shortUrl} size={150} />
                              </Paper>
                            </Box>
                          </Collapse>
                          <Collapse
                            in={expandedLinkId === link.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <AnimatePresence>
                              {expandedLinkId === link.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Paper
                                    sx={{
                                      p: { xs: 2, sm: 3 },
                                      m: { xs: 1, sm: 2 },
                                      bgcolor: "background.paper",
                                    }}
                                  >
                                    <Grid container spacing={3}>
                                      {/* Row 1: Title */}
                                      <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                          Analytics for {link.shortUrl}
                                        </Typography>
                                      </Grid>
                                      {/* Row 2: Charts */}
                                      <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                          <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            sx={{ minWidth: 300 }}
                                          >
                                            <Paper
                                              elevation={1}
                                              sx={{
                                                p: 2,
                                                height: "100%",
                                                bgcolor: "background.default",
                                              }}
                                            >
                                              <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                                align="center"
                                              >
                                                Clicks Over Time
                                              </Typography>
                                              <Box sx={{ height: 280 }}>
                                                <ResponsiveContainer
                                                  width="100%"
                                                  height="100%"
                                                >
                                                  <iframe
                                                    src={`https://charts.mongodb.com/charts-dacoid-ivjizlo/embed/charts?id=46fd37f7-82a4-4d5f-8e56-1077be7e729e&theme=light&autoRefresh=true&filter={"linkId":{"$oid":"${link.id}"}}`}
                                                    style={{
                                                      width: "100%",
                                                      height: "100%",
                                                      border: "none",
                                                    }}
                                                    title="Trend Chart"
                                                  />
                                                </ResponsiveContainer>
                                              </Box>
                                            </Paper>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            sx={{ minWidth: 300 }}
                                          >
                                            <Paper
                                              elevation={1}
                                              sx={{
                                                p: 2,
                                                height: "100%",
                                                bgcolor: "background.default",
                                              }}
                                            >
                                              <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                                align="center"
                                              >
                                                Device Breakdown
                                              </Typography>
                                              <Box sx={{ height: 280 }}>
                                                <ResponsiveContainer
                                                  width="100%"
                                                  height="100%"
                                                >
                                                  <iframe
                                                    src={`https://charts.mongodb.com/charts-dacoid-ivjizlo/embed/charts?id=132a1c60-9be3-49a3-ae29-669788af674a&theme=light&autoRefresh=true&filter={"linkId":{"$oid":"${link.id}"}}`}
                                                    style={{
                                                      width: "100%",
                                                      height: "100%",
                                                      border: "none",
                                                    }}
                                                    title="Trend Chart"
                                                  />
                                                </ResponsiveContainer>
                                              </Box>
                                            </Paper>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            md={4}
                                            sx={{ minWidth: 300 }}
                                          >
                                            <Paper
                                              elevation={1}
                                              sx={{
                                                p: 2,
                                                height: "100%",
                                                bgcolor: "background.default",
                                              }}
                                            >
                                              <Typography
                                                variant="subtitle1"
                                                gutterBottom
                                                align="center"
                                              >
                                                Browser Breakdown
                                              </Typography>
                                              <Box sx={{ height: 280 }}>
                                                <ResponsiveContainer
                                                  width="100%"
                                                  height="100%"
                                                >
                                                  <iframe
                                                    src={`https://charts.mongodb.com/charts-dacoid-ivjizlo/embed/charts?id=7617214f-80ab-40fc-941d-6af52de67774&theme=light&autoRefresh=true&filter={"linkId":{"$oid":"${link.id}"}}`}
                                                    style={{
                                                      width: "100%",
                                                      height: "100%",
                                                      border: "none",
                                                    }}
                                                    title="Trend Chart"
                                                  />
                                                </ResponsiveContainer>
                                              </Box>
                                            </Paper>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Paper>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </motion.div>
    </AppLayout>
  );
}

export default DashboardPage;
