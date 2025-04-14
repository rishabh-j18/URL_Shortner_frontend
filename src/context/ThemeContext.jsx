"use client"

import { createContext, useState, useMemo, useContext } from "react"
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light")

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#3f51b5",
          },
          secondary: {
            main: "#f50057",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode],
  )

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
