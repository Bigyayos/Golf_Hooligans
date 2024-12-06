// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Verde, color principal
    },
    secondary: {
      main: '#8bc34a', // Verde claro, color secundario
    },
    background: {
      default: '#f0f4c3', // Fondo claro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h2: {
      fontFamily: 'Georgia, serif', // Fuente elegante para títulos
      color: '#2e7d32', // Verde oscuro para títulos
    },
    h4: {
      color: '#388e3c', // Verde medio para subtítulos
    },
  },
});

export default theme;