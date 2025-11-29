import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  getAllAdmins,
  createAdmin,
  toggleAdminStatus,
  unlockAdminAccount,
  getAdminStatistics,
  getAdminActivity
} from '../../api/adminApi';
import { format } from 'date-fns';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [selectedAdminActivity, setSelectedAdminActivity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminsData, statsData] = await Promise.all([
        getAllAdmins(),
        getAdminStatistics()
      ]);
      setAdmins(adminsData.admins || []);
      setStatistics(statsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAdmin = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        alert('Please fill all required fields');
        return;
      }

      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      await createAdmin(formData);
      setOpenCreateDialog(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchData();
      alert('Admin created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this admin?`)) {
      try {
        await toggleAdminStatus(adminId);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || `Failed to ${action} admin`);
      }
    }
  };

  const handleUnlockAccount = async (adminId) => {
    if (window.confirm('Are you sure you want to unlock this admin account?')) {
      try {
        await unlockAdminAccount(adminId);
        fetchData();
        alert('Admin account unlocked successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to unlock admin account');
      }
    }
  };

  const handleViewActivity = async (adminId) => {
    try {
      const activityData = await getAdminActivity(adminId, { limit: 50 });
      setSelectedAdminActivity(activityData);
      setOpenActivityDialog(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load activity');
    }
  };

  const formatDate = (date) => {
    try {
      return date ? format(new Date(date), 'MMM dd, yyyy HH:mm') : 'Never';
    } catch {
      return 'Invalid date';
    }
  };

  const isAccountLocked = (admin) => {
    return admin.lockUntil && new Date(admin.lockUntil) > new Date();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Admin Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Create Admin
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Statistics */}
          {statistics && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {statistics.totalAdmins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Admins
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {statistics.activeAdmins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {statistics.lockedAdmins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Locked
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {statistics.recentLogins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Logins (24h)
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Admins Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Login Attempts</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id} hover>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={admin.role} 
                        color={admin.role === 'super_admin' ? 'error' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {isAccountLocked(admin) ? (
                        <Chip label="Locked" color="error" size="small" />
                      ) : admin.isActive ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(admin.lastLogin)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {admin.loginAttempts > 0 && (
                        <Chip 
                          label={`${admin.loginAttempts} failed`} 
                          color="warning" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Activity">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewActivity(admin._id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {isAccountLocked(admin) && (
                          <Tooltip title="Unlock Account">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleUnlockAccount(admin._id)}
                            >
                              <LockOpenIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title={admin.isActive ? "Deactivate" : "Activate"}>
                          <IconButton 
                            size="small" 
                            color={admin.isActive ? "error" : "success"}
                            onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                          >
                            {admin.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Admin</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  helperText="Minimum 6 characters"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAdmin} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog 
        open={openActivityDialog} 
        onClose={() => setOpenActivityDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Admin Activity - {selectedAdminActivity?.admin?.name}
        </DialogTitle>
        <DialogContent>
          {selectedAdminActivity && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedAdminActivity.activities?.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip label={activity.action.replace(/_/g, ' ')} size="small" />
                      </TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(activity.timestamp)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActivityDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagement;
