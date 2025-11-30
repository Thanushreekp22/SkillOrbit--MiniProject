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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
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
  AccountCircle,
  DeleteForever,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import PageHeader from '../components/PageHeader';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
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

  const deleteReasons = [
    'Not using the platform anymore',
    'Found a better alternative',
    'Privacy concerns',
    'Too many notifications',
    'Difficulty using the platform',
    'Not getting value from the service',
    'Other'
  ];

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
      setProfilePhoto(user.profilePhoto || null);
    }
  }, [user]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await api.post(`/users/${user._id}/profile-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfilePhoto(response.data.profilePhoto);
      updateUser({ ...user, profilePhoto: response.data.profilePhoto });
      toast.success('Profile photo updated successfully!');
    } catch (err) {
      console.error('Photo upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason) {
      toast.error('Please select a reason for deleting your account');
      return;
    }

    if (deleteReason === 'Other' && !otherReason.trim()) {
      toast.error('Please provide a reason for deleting your account');
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/users/${user._id}/account`, {
        data: {
          reason: deleteReason,
          otherReason: deleteReason === 'Other' ? otherReason : null
        }
      });

      toast.success('Account deleted successfully. We\'re sorry to see you go!');
      
      // Logout and redirect after a short delay
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
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
                  src={profilePhoto || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    background: profilePhoto ? 'transparent' : '#6366F1',
                    fontWeight: 700,
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {!profilePhoto && formData.name?.charAt(0).toUpperCase()}
                </Avatar>
                <input
                  accept="image/*"
                  type="file"
                  id="profile-photo-upload"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                <label htmlFor="profile-photo-upload">
                  <IconButton
                    component="span"
                    disabled={uploadingPhoto}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#6366F1',
                      color: 'white',
                      '&:hover': { bgcolor: '#4F46E5' },
                      '&:disabled': { bgcolor: '#9CA3AF' },
                    }}
                    size="small"
                  >
                    {uploadingPhoto ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera fontSize="small" />}
                  </IconButton>
                </label>
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
                    background: '#10B981',
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
                      background: '#6366F1',
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
                        background: '#10B981',
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

          {/* Danger Zone - Delete Account */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
              borderRadius: '16px',
              border: '2px solid',
              borderColor: 'error.light',
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Warning color="error" sx={{ fontSize: 32 }} />
                <Typography variant="h5" fontWeight={600} color="error.main">
                  Danger Zone
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'error.light' }} />
              
              <Typography variant="body1" color="text.secondary" mb={3}>
                Once you delete your account, there is no going back. This will permanently delete your profile, assessments, learning paths, and all associated data.
              </Typography>
              
              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<DeleteForever />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'error.main',
                    color: 'white',
                  },
                }}
              >
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Warning color="error" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Delete Account?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="error" sx={{ mb: 3 }}>
            <strong>Warning:</strong> All your data including assessments, learning paths, skills, and progress will be permanently deleted.
          </Alert>

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
              Please tell us why you're leaving:
            </FormLabel>
            <RadioGroup
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            >
              {deleteReasons.map((reason) => (
                <FormControlLabel
                  key={reason}
                  value={reason}
                  control={<Radio />}
                  label={reason}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {deleteReason === 'Other' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Please specify your reason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Tell us why you're deleting your account..."
              sx={{ mt: 2 }}
              required
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteReason('');
              setOtherReason('');
            }}
            disabled={deleting}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleting || !deleteReason}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteForever />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
            }}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;

