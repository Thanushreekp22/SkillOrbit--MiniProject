import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Slide,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  HowToReg,
  ArrowBack,
  Login as LoginIcon,
  MarkEmailRead,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../api/axios';
import SkillOrbitLogo from '../components/SkillOrbitLogo';

const Register = () => {
  const [step, setStep] = useState(0); // 0: Registration form, 1: OTP verification, 2: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // First, check if email exists
      const emailCheckResponse = await api.post('/users/check-email', {
        email: formData.email
      });

      if (emailCheckResponse.data.exists && emailCheckResponse.data.verified) {
        // Email already registered and verified
        setError('This email is already registered. Please login instead.');
        toast.error('This email is already registered. Please login instead.');
        setLoading(false);
        return;
      }

      // Proceed with registration
      const response = await api.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.requiresVerification) {
        setUserId(response.data.userId);
        toast.success('✅ OTP sent to your email! Please check your inbox.');
        setStep(1); // Move to OTP verification step
      } else {
        // Auto-verified (email service disabled)
        if (response.data.token) {
          // User is already logged in
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Registration successful! Redirecting...');
          setTimeout(() => {
            navigate('/app/dashboard');
          }, 1500);
        } else {
          // Just show success and redirect to login
          toast.success('Registration successful! Please login.');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/users/verify-otp', {
        userId,
        otp,
      });

      toast.success('Email verified successfully! Your account is now active.');
      setStep(2); // Show success message
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      await api.post('/users/resend-otp', { userId });
      toast.success('New OTP sent to your email! Please check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
    
    setResendLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: '#667eea',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '-250px',
            right: '-250px',
            animation: 'float 7s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            bottom: '-175px',
            left: '-175px',
            animation: 'float 9s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(180deg)' },
          },
        }}
      />

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          {/* Back to Home Button */}
          <Fade in timeout={500}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Back to Home
            </Button>
          </Fade>

          <Slide direction="up" in timeout={800}>
            <Paper
              elevation={24}
              sx={{
                padding: { xs: 2.5, sm: 3.5 },
                width: '100%',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              {/* Logo and Title */}
              <Box textAlign="center" mb={2}>
                <Box display="flex" justifyContent="center" mb={1}>
                  <SkillOrbitLogo variant="dark" size="medium" withText={true} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 700,
                    background: '#667eea',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  Join SkillOrbit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start your journey to skill mastery
                </Typography>
              </Box>

              {/* Stepper */}
              <Box sx={{ mb: 3 }}>
                <Stepper activeStep={step} alternativeLabel>
                  <Step>
                    <StepLabel>Create Account</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Verify Email</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Complete</StepLabel>
                  </Step>
                </Stepper>
              </Box>

              {error && (
                <Fade in>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: '12px',
                      animation: 'shake 0.5s',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '25%': { transform: 'translateX(-10px)' },
                        '75%': { transform: 'translateX(10px)' },
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              {/* Step 0: Registration Form */}
              {step === 0 && (
                <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={loading ? null : <HowToReg />}
                  sx={{
                    mt: 2.5,
                    mb: 1.5,
                    py: 1.3,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: '#667eea',
                    boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Already have an account?
                  </Typography>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    fullWidth
                    startIcon={<LoginIcon />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.2,
                      borderWidth: '2px',
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 600,
                      '&:hover': {
                        borderWidth: '2px',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
              )}

              {/* Step 1: OTP Verification */}
              {step === 1 && (
                <Box component="form" onSubmit={handleVerifyOTP}>
                  <Box textAlign="center" mb={3}>
                    <MarkEmailRead sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Verify Your Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We've sent a 6-digit OTP to
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight={600}>
                      {formData.email}
                    </Typography>
                  </Box>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="Enter OTP"
                    name="otp"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) setOtp(value);
                    }}
                    placeholder="000000"
                    inputProps={{
                      maxLength: 6,
                      style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || otp.length !== 6}
                    endIcon={loading ? null : <CheckCircle />}
                    sx={{
                      mt: 2.5,
                      mb: 1.5,
                      py: 1.3,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: '#667eea',
                      boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
                  </Button>

                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Didn't receive the OTP?
                    </Typography>
                    <Button
                      onClick={handleResendOTP}
                      disabled={resendLoading}
                      sx={{
                        textTransform: 'none',
                        color: '#667eea',
                        fontWeight: 600,
                      }}
                    >
                      {resendLoading ? 'Sending...' : 'Resend OTP'}
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    fullWidth
                    onClick={() => setStep(0)}
                    disabled={loading}
                    sx={{
                      textTransform: 'none',
                      color: 'text.secondary',
                    }}
                  >
                    ← Back to Registration
                  </Button>
                </Box>
              )}

              {/* Step 2: Success */}
              {step === 2 && (
                <Box textAlign="center" py={4}>
                  <CheckCircle sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
                  <Typography variant="h4" fontWeight={700} color="#10b981" gutterBottom>
                    Account Created!
                  </Typography>
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    Your email has been verified successfully
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Redirecting to login page...
                  </Typography>
                  <CircularProgress />
                </Box>
              )}
            </Paper>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;

