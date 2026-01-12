import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGoogleAuth = () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Google authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token && userParam) {
        try {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(userParam));

          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));

          // Update auth context
          if (setUser) {
            setUser(userData);
          }

          toast.success(`Welcome back, ${userData.name}!`);
          navigate('/app/dashboard');
        } catch (err) {
          console.error('Error parsing OAuth response:', err);
          toast.error('Authentication error. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('Invalid authentication response.');
        navigate('/login');
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, setUser]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#667eea',
      }}
    >
      <CircularProgress size={64} sx={{ color: 'white', mb: 3 }} />
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
        Completing Google Sign-In...
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
        Please wait while we set up your account
      </Typography>
    </Box>
  );
};

export default GoogleAuthSuccess;
