import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#16324F",
    },

    secondary: {
      main: "#0F9D8A",
    },

    background: {
      default: "#F4F7FA",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#273746",
      secondary: "#81909D",
    },

    success: {
      main: "#16803C",
    },

    warning: {
      main: "#F2A900",
    },

    error: {
      main: "#B42318",
    },

    info: {
      main: "#2673C9",
    },
  },

  typography: {
    fontFamily: '"Outfit", "Roboto", sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  components: {
    MuiCard: {
  styleOverrides: {
    root: {
      borderRadius: 14,
      border: "none",
      boxShadow: "none",
    },
  },
},

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});