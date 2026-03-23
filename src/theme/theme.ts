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
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
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
          paper: '#FFFFFF',       // Card background in light mode
        },
        text: {
          primary: '#1D1A25',     // On Surface
          secondary: '#49454F',   // On Surface Variant
        },
        divider: 'rgba(29, 26, 37, 0.12)',
        action: {
          hover: 'rgba(64, 6, 188, 0.04)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#C09CFF',        // Lighter Purple for dark mode
          light: '#E6D4FF',       
          dark: '#8C6CFA',        
          contrastText: '#1D1A25',
        },
        secondary: {
          main: '#A8C4A2',        // Sage 80
          light: '#D3E8CD',       
          dark: '#6B9E6B',        
          contrastText: '#1D1A25',
        },
        error: {
          main: '#FFB4AB',
          light: '#FFDAD6',
          dark: '#93000A',
        },
        background: {
          default: '#141218',     // True Dark Surface
          paper: '#211F26',       // Elevated surface
        },
        text: {
          primary: '#E6E1E5',     // Light text on dark
          secondary: '#CAC4D0',   // Muted light text
        },
        divider: 'rgba(230, 225, 229, 0.12)',
        action: {
          hover: 'rgba(192, 156, 255, 0.08)',
        },
      },
    },
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
