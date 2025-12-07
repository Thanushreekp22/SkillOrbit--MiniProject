import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import {
  Dashboard,
  People,
  QuestionAnswer,
  AdminPanelSettings,
  ExitToApp,
  History,
  SupervisorAccount,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const AdminNavbar = ({ title, adminData }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard /> },
    { label: 'Users', path: '/admin/users', icon: <People /> },
    { label: 'Questions', path: '/admin/questions', icon: <QuestionAnswer /> },
    { label: 'Activity Log', path: '/admin/activity', icon: <History /> },
    { label: 'Admin Management', path: '/admin/management', icon: <SupervisorAccount /> },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: '#667eea' }}>
      <Toolbar>
        <AdminPanelSettings sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" sx={{ flexGrow: 0, fontWeight: 700, mr: 4 }}>
          {title || 'Admin Panel'}
        </Typography>

        {/* Navigation Menu */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Admin Profile */}
        <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            {adminData?.name?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {adminData?.email || 'Admin'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
