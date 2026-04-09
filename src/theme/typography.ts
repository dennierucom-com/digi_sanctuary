/**
 * M3-inspired type scale using the Outfit font family.
 * Falls back to system fonts for maximum compatibility.
 */
export const typography = {
  fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',

  h1: {
    fontSize: '2.25rem',   // Display Small
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '1.75rem',   // Headline Large
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  h3: {
    fontSize: '1.5rem',    // Headline Medium
    fontWeight: 400,
    lineHeight: 1.35,
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '1.25rem',   // Headline Small
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  h5: {
    fontSize: '1rem',      // Title Large
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  h6: {
    fontSize: '0.875rem',  // Title Medium
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  subtitle1: {
    fontSize: '1rem',      // Title Large
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  subtitle2: {
    fontSize: '0.875rem',  // Title Small
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.01em',
  },
  body1: {
    fontSize: '1rem',      // Body Large
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.03em',
  },
  body2: {
    fontSize: '0.875rem',  // Body Medium
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.02em',
  },
  button: {
    fontSize: '0.875rem',  // Label Large
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02em',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',   // Body Small
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0.03em',
  },
  overline: {
    fontSize: '0.6875rem', // Label Small
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
};
