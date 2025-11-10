import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5',
          },
          secondary: {
            main: '#0EA5E9',
            light: '#38BDF8',
            dark: '#0284C7',
          },
          background: {
            default: mode === 'light' ? '#F9FAFB' : '#0F172A',
            paper: mode === 'light' ? '#FFFFFF' : '#1E293B',
          },
          text: {
            primary: mode === 'light' ? '#1E293B' : '#F1F5F9',
            secondary: mode === 'light' ? '#64748B' : '#94A3B8',
          },
        },
        typography: {
          fontFamily: '"Inter", "Poppins", sans-serif',
          h1: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
          },
          h2: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
          },
          h3: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
          },
          h4: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
          },
          h5: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
          },
          h6: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: mode === 'light' 
                  ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                  : '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
