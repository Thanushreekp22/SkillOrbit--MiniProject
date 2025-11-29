import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  QuestionAnswer,
  ExitToApp,
  Menu as MenuIcon,
  AccountCircle,
  TrendingUp,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPlatformAnalytics } from '../../api/adminApi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getPlatformAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard', route: '/admin/dashboard' },
    { text: 'Questions', icon: <QuestionAnswer />, section: 'questions', route: '/admin/questions' },
    { text: 'My Activity', icon: <HistoryIcon />, section: 'activity', route: '/admin/activity' },
    { text: 'Admin Management', icon: <SupervisorAccountIcon />, section: 'management', route: '/admin/management' }
  ];

  const handleTabChange = (event, newValue) => {
    const item = menuItems[newValue];
    if (item.route) {
      navigate(item.route);
    }
    setActiveSection(item.section);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 4 }}>
            SkillOrbit Admin
          </Typography>

          {/* Navigation Tabs */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Tabs
              value={menuItems.findIndex(item => item.section === activeSection)}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: '#fff',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              {menuItems.map((item, index) => (
                <Tab
                  key={item.text}
                  icon={item.icon}
                  label={item.text}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* User Menu */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{adminData.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
            Admin Menu
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={activeSection === item.section}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  }
                  setActiveSection(item.section);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.2)'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: activeSection === item.section ? '#667eea' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          p: 3,
          mt: 10
        }}
      >
        <Container maxWidth="xl">
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#667eea', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.overview?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Registered users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#f093fb', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Assessments
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.overview?.totalAssessments || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Completed tests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#4facfe', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Skills
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.overview?.totalSkills || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Skills tracked
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#43e97b', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Questions
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {analytics?.overview?.totalQuestions || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Question bank
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* User Growth Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  User Growth (Last 6 Months)
                </Typography>
                {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id.month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No data available yet</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Assessment Activity Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Assessment Activity (Last 30 Days)
                </Typography>
                {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.recentActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#764ba2" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No assessment data available yet</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Top Skills */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Skills by Proficiency
                </Typography>
                {analytics?.topSkills && analytics.topSkills.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topSkills.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgProficiency" fill="#667eea" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No skill data available yet</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Skills by Category */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Skills by Category
                </Typography>
                {analytics?.skillsByCategory && analytics.skillsByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.skillsByCategory}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analytics.skillsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No category data available yet</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<QuestionAnswer />}
                onClick={() => navigate('/admin/questions')}
                sx={{ background: '#667eea' }}
              >
                Manage Questions
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                onClick={fetchAnalytics}
              >
                Refresh Analytics
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
