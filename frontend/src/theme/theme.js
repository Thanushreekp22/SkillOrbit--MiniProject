// SkillOrbit Theme Configuration
// Modern, clean, futuristic design inspired by LinkedIn + Notion + Duolingo

export const theme = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      main: '#6366F1',      // Indigo - Intelligence, trust, modern tech
      light: '#818CF8',
      dark: '#4F46E5',
      gradient: 'linear-gradient(90deg, #6366F1 0%, #0EA5E9 100%)',
    },
    
    // Secondary Colors
    secondary: {
      main: '#0EA5E9',      // Teal Blue - Fresh, calm energy
      light: '#38BDF8',
      dark: '#0284C7',
    },
    
    // Accent Colors
    accent: {
      success: '#10B981',   // Emerald Green - Positive feedback, AI highlights
      successLight: '#D1FAE5',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      error: '#EF4444',     // Coral Red - Errors, warnings
      errorLight: '#FEE2E2',
      info: '#3B82F6',
      infoLight: '#DBEAFE',
    },
    
    // Neutral Colors
    neutral: {
      white: '#FFFFFF',
      background: '#F9FAFB',  // Soft White/Light Gray
      card: '#FFFFFF',
      border: '#E5E7EB',
      divider: '#F3F4F6',
    },
    
    // Text Colors
    text: {
      primary: '#1E293B',     // Charcoal/Slate - High readability
      secondary: '#64748B',   // Cool Gray - Labels, secondary info
      disabled: '#94A3B8',
      inverse: '#FFFFFF',
    },
    
    // Dark Mode (Optional)
    dark: {
      primary: '#3B82F6',
      background: '#0F172A',
      card: '#1E293B',
      text: '#E2E8F0',
      textSecondary: '#94A3B8',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      brand: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    lg: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    xl: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    card: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    cardHover: '0px 4px 12px rgba(99, 102, 241, 0.15)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// MUI Theme Override
export const muiTheme = {
  palette: {
    primary: {
      main: theme.colors.primary.main,
      light: theme.colors.primary.light,
      dark: theme.colors.primary.dark,
    },
    secondary: {
      main: theme.colors.secondary.main,
      light: theme.colors.secondary.light,
      dark: theme.colors.secondary.dark,
    },
    success: {
      main: theme.colors.accent.success,
      light: theme.colors.accent.successLight,
    },
    error: {
      main: theme.colors.accent.error,
      light: theme.colors.accent.errorLight,
    },
    warning: {
      main: theme.colors.accent.warning,
      light: theme.colors.accent.warningLight,
    },
    info: {
      main: theme.colors.accent.info,
      light: theme.colors.accent.infoLight,
    },
    background: {
      default: theme.colors.neutral.background,
      paper: theme.colors.neutral.card,
    },
    text: {
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary,
      disabled: theme.colors.text.disabled,
    },
  },
  typography: {
    fontFamily: theme.typography.fontFamily.primary,
    h1: {
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize['4xl'],
    },
    h2: {
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.semibold,
      fontSize: theme.typography.fontSize['3xl'],
    },
    h3: {
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.semibold,
      fontSize: theme.typography.fontSize['2xl'],
    },
    h4: {
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.medium,
      fontSize: theme.typography.fontSize.xl,
    },
    h5: {
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.medium,
      fontSize: theme.typography.fontSize.lg,
    },
    h6: {
      fontFamily: theme.typography.fontFamily.heading,
      fontWeight: theme.typography.fontWeight.medium,
      fontSize: theme.typography.fontSize.base,
    },
    body1: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.base,
    },
    body2: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm,
    },
    button: {
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.medium,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    theme.shadows.sm,
    theme.shadows.md,
    theme.shadows.lg,
    theme.shadows.xl,
    theme.shadows.card,
    theme.shadows.cardHover,
    ...Array(18).fill(theme.shadows.xl),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.md,
          padding: '10px 24px',
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.medium,
          textTransform: 'none',
          boxShadow: 'none',
          transition: theme.transitions.normal,
          '&:hover': {
            boxShadow: theme.shadows.md,
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            filter: 'brightness(110%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.card,
          transition: theme.transitions.normal,
          '&:hover': {
            boxShadow: theme.shadows.cardHover,
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.borderRadius.md,
            backgroundColor: '#F1F5F9',
            '&:hover': {
              backgroundColor: '#E2E8F0',
            },
            '&.Mui-focused': {
              backgroundColor: theme.colors.neutral.white,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.primary.main,
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.md,
          fontWeight: theme.typography.fontWeight.medium,
        },
      },
    },
  },
};

export default theme;
