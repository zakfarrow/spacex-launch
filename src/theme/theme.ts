import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "1.1rem",
    },
    body1: {
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      main: "#f97316", // Orange-500
      dark: "#c2410c", // Orange-700
    },
    secondary: {
      main: "#94a3b8", // Slate-400
    },
    background: {
      default: "#f8fafc", // Slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Slate-800
      secondary: "#64748b", // Slate-500
    },
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#f97316",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f8fafc",
          },
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "20px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#c2410c",
            "& .MuiTableSortLabel-icon": {
              color: "#c2410c",
            },
          },
          "&:hover": {
            color: "#c2410c",
          },
        },
      },
    },
  },
});

export default theme;
