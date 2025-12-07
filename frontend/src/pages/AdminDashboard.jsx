import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  People,
  QuestionAnswer,
  ExitToApp,
  Settings,
  TrendingUp,
  Assessment,
  School,
  AdminPanelSettings,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api/axios';
import AdminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    
    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(admin));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Configure API to use admin token
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [statsResponse, usersResponse] = await Promise.all([
        api.get('/admin/dashboard/stats', config),
        api.get('/admin/dashboard/recent-users', config),
      ]);

      setStats(statsResponse.data);
      setRecentUsers(usersResponse.data.users || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={64} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar title="SkillOrbit Admin Panel" adminData={adminData} />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Welcome back, {adminData?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your platform today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#667eea', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Users
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalUsers || 0}
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f5576c', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Questions
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalQuestions || 0}
                    </Typography>
                  </Box>
                  <QuestionAnswer sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#00bcd4', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Assessments
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalAssessments || 0}
                    </Typography>
                  </Box>
                  <Assessment sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Skills Tracked
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalSkills || 0}
                    </Typography>
                  </Box>
                  <School sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<QuestionAnswer />}
              onClick={() => navigate('/admin/questions')}
              sx={{
                py: 2,
                bgcolor: '#667eea',
                '&:hover': {
                  bgcolor: '#5568d3',
                },
              }}
            >
              Questions
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<People />}
              onClick={() => navigate('/admin/users')}
              sx={{
                py: 2,
                bgcolor: '#f5576c',
                '&:hover': {
                  bgcolor: '#e4465b',
                },
              }}
            >
              Users
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<TrendingUp />}
              onClick={() => navigate('/admin/activity')}
              sx={{
                py: 2,
                bgcolor: '#4caf50',
                '&:hover': {
                  bgcolor: '#45a049',
                },
              }}
            >
              My Activity
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Settings />}
              onClick={() => navigate('/admin/management')}
              sx={{
                py: 2,
                bgcolor: '#ff9800',
                '&:hover': {
                  bgcolor: '#f57c00',
                },
              }}
            >
              Admin Mgmt
            </Button>
          </Grid>
        </Grid>

        {/* Recent Users Table */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={700}>
            Recent Users
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Joined</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.slice(0, 10).map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isVerified ? 'Verified' : 'Pending'}
                        color={user.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
