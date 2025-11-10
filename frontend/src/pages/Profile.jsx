import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  School,
  Work,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  LinkedIn,
  GitHub,
  Language,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    education: '',
    currentRole: '',
    company: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    skills: [],
    interests: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        education: user.education || '',
        currentRole: user.currentRole || '',
        company: user.company || '',
        linkedIn: user.linkedIn || '',
        github: user.github || '',
        portfolio: user.portfolio || '',
        skills: user.skills || [],
        interests: user.interests || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/users/${user._id}/profile`, formData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        education: user.education || '',
        currentRole: user.currentRole || '',
        company: user.company || '',
        linkedIn: user.linkedIn || '',
        github: user.github || '',
        portfolio: user.portfolio || '',
        skills: user.skills || [],
        interests: user.interests || [],
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, professional details, and social links"
        icon={<AccountCircle sx={{ fontSize: '2rem' }} />}
      />

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              position: 'sticky',
              top: 80,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    background: 'linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)',
                    fontWeight: 700,
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {formData.name?.charAt(0).toUpperCase()}
                </Avatar>
                {editMode && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#6366F1',
                      color: 'white',
                      '&:hover': { bgcolor: '#4F46E5' },
                    }}
                    size="small"
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {formData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {formData.email}
              </Typography>

              {formData.currentRole && (
                <Chip
                  icon={<Work />}
                  label={formData.currentRole}
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'left' }}>
                {formData.location && (
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <LocationOn sx={{ color: '#64748B', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formData.location}
                    </Typography>
                  </Box>
                )}
                {formData.company && (
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <Work sx={{ color: '#64748B', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formData.company}
                    </Typography>
                  </Box>
                )}
                {formData.education && (
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <School sx={{ color: '#64748B', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formData.education}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="center" gap={1}>
                {formData.linkedIn && (
                  <IconButton
                    href={formData.linkedIn}
                    target="_blank"
                    sx={{
                      bgcolor: '#F1F5F9',
                      '&:hover': { bgcolor: '#E2E8F0', color: '#0A66C2' },
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                )}
                {formData.github && (
                  <IconButton
                    href={formData.github}
                    target="_blank"
                    sx={{
                      bgcolor: '#F1F5F9',
                      '&:hover': { bgcolor: '#E2E8F0', color: '#1E293B' },
                    }}
                  >
                    <GitHub />
                  </IconButton>
                )}
                {formData.portfolio && (
                  <IconButton
                    href={formData.portfolio}
                    target="_blank"
                    sx={{
                      bgcolor: '#F1F5F9',
                      '&:hover': { bgcolor: '#E2E8F0', color: '#6366F1' },
                    }}
                  >
                    <Language />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Information Form */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Personal Information
                </Typography>
                {!editMode ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                    sx={{
                      background: 'linear-gradient(90deg, #6366F1 0%, #0EA5E9 100%)',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}>
                      Basic Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="City, Country"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!editMode}
                      multiline
                      rows={3}
                      placeholder="Tell us about yourself..."
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  {/* Professional Information */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}>
                      Professional Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current Role"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="e.g., Software Engineer"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Current company"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="e.g., B.Tech in Computer Science"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  {/* Social Links */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}>
                      Social Links
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="LinkedIn Profile"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="https://linkedin.com/in/yourprofile"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GitHub Profile"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="https://github.com/yourusername"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Portfolio Website"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="https://yourportfolio.com"
                      InputProps={{
                        sx: { borderRadius: '8px' },
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
