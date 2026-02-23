export const tokens = {
  colors: {
    background: '#05010F',
    primary: '#7B2CFF',
    secondary: '#4DA3FF',
    glow: '#B388FF',
    text: '#EAEAF0',
    textSecondary: '#9CA3AF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '32px',
    xl: '64px',
    xxl: '128px',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '20px',
  },
  transition: {
    fast: '0.2s ease',
    normal: '0.35s ease',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Cascadia Code", Consolas, Monaco, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem',
  },
  shadows: {
    glow: '0 0 20px rgba(123, 44, 255, 0.3)',
    glowStrong: '0 0 30px rgba(123, 44, 255, 0.5)',
    card: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
} as const;

export type Theme = typeof tokens;
