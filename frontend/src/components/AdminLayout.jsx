import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  QuestionAnswer,
  ExitToApp,
  Menu as MenuIcon,
  AccountCircle,
  History as HistoryIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, route: '/admin/dashboard' },
    { text: 'Questions', icon: <QuestionAnswer />, route: '/admin/questions' },
    { text: 'My Activity', icon: <HistoryIcon />, route: '/admin/activity' },
    { text: 'Admin Management', icon: <SupervisorAccountIcon />, route: '/admin/management' }
  ];

  const getCurrentTabValue = () => {
    const index = menuItems.findIndex(item => location.pathname === item.route);
    return index >= 0 ? index : 0;
  };

  const handleTabChange = (event, newValue) => {
    navigate(menuItems[newValue].route);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

          {/* Navigation Tabs - Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Tabs
              value={getCurrentTabValue()}
              onChange={handleTabChange}
              textColor="inherit"
              TabIndicatorProps={{
                style: { backgroundColor: '#fff', height: 3 }
              }}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: '#fff',
                    fontWeight: 'bold'
                  },
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)'
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

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* User Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {adminData.name}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight="bold">{adminData.name}</Typography>
                <Typography variant="caption" color="text.secondary">{adminData.email}</Typography>
              </Box>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 }
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
                selected={location.pathname === item.route}
                onClick={() => {
                  navigate(item.route);
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
                <ListItemIcon sx={{ color: location.pathname === item.route ? '#667eea' : 'inherit' }}>
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
          pt: 10,
          pb: 4,
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
