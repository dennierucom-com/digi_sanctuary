import { createTheme } from '@mui/material/styles';
import { typography } from './typography';

/**
 * Material Design 3 inspired theme for Digi Sanctuary.
 *
 * Primary:   Soft Lavender tonal palette
 * Secondary: Sage Green tonal palette
 * Surface:   Warm near-white tones
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4006BC',        // Brand Purple
      light: '#7242E8',       
      dark: '#2A0082',        
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6B9E6B',        // Sage 40
      light: '#A8C4A2',       // Sage 80
      dark: '#4A7A4A',        // Sage 30
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
      light: '#FFDAD6',
      dark: '#93000A',
    },
    background: {
      default: '#FAF8FF',     // Surface
      paper: '#F3EFF9',       // Surface Container Low
    },
    text: {
      primary: '#1D1A25',     // On Surface
      secondary: '#49454F',   // On Surface Variant
    },
    divider: 'rgba(29, 26, 37, 0.12)',
  },
  shape: {
    borderRadius: 16,          // M3 medium rounding
  },
  typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #9373B5 0%, #C4B5E0 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #6B9E6B 0%, #A8C4A2 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.05)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '16px 0',
        },
      },
    },
  },
});

export default theme;
