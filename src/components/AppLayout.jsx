"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Tooltip,
  Avatar,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { hover } from "framer-motion";

function AppLayout({ children, title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
              onClick={() => handleNavigation("/dashboard")}
            >
              DACOID URL Shortener
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={() => handleNavigation("/dashboard")}>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              URL Shortener
            </Typography>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={() => handleNavigation("/dashboard")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Dashboard
              </Button>
            </Box>

            {/* Theme toggle */}
            <Box sx={{ mr: 2 }}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>

            {/* Create button */}
            <Box sx={{ mr: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create")}
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                New Link
              </Button>
              <IconButton
                color="inherit"
                onClick={() => navigate("/create")}
                sx={{ display: { xs: "flex", sm: "none" } }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* User menu */}
            <Box>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.email} src="/static/avatar.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography textAlign="center">{user?.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              ":hover": {
                textDecoration: "underline",
                color: "primary.main",
              },
            }}
            onClick={() => {
              window.open("https://github.com/rishabh-j18", "_blank");
            }}
          >
            URL Shortener & Analytics Dashboard © Rishabh Jaiswal
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AppLayout;
