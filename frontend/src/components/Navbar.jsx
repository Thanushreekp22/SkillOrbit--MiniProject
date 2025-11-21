import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Psychology,
  Work,
  Analytics,
  School,
  TrendingUp,
  Assessment,
  AccountCircle,
  Logout,
  AutoAwesome,
  Description,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import SkillOrbitLogo from './SkillOrbitLogo';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
  { text: 'Skills', icon: <Psychology />, path: '/app/skills' },
  { text: 'Assessment', icon: <Assessment />, path: '/app/assessment' },
  { text: 'Roles', icon: <Work />, path: '/app/roles' },
  { text: 'Analysis', icon: <Analytics />, path: '/app/analysis' },
  { text: 'Learning Path', icon: <School />, path: '/app/learning-path' },
  { text: 'Progress', icon: <TrendingUp />, path: '/app/progress' },
  { text: 'Reports', icon: <Description />, path: '/app/reports' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar sx={{ 
        background: '#6366F1',
        minHeight: '100px !important',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        position: 'relative',
        overflow: 'hidden',
        py: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        },
      }}>
        <Box sx={{ zIndex: 1 }}>
          <SkillOrbitLogo variant="light" size="small" withText={false} />
        </Box>
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1,
            fontSize: '1.1rem',
          }}
        >
          SkillOrbit
        </Typography>
        <Typography 
          variant="caption" 
          sx={{
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
            letterSpacing: '1.2px',
            fontSize: '0.65rem',
            zIndex: 1,
          }}
        >
          ANALYZE • IMPROVE • EVOLVE
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: '12px',
              mb: 0.5,
              transition: 'all 0.25s ease-in-out',
              '&:hover': {
                backgroundColor: '#F1F5F9',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                backgroundColor: '#EEF2FF',
                borderLeft: '4px solid #6366F1',
                '&:hover': {
                  backgroundColor: '#E0E7FF',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? '#6366F1' : '#64748B',
              minWidth: '40px',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontSize: '0.95rem',
                color: location.pathname === item.path ? '#1E293B' : '#64748B',
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: '#6366F1',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'SkillOrbit'}
          </Typography>
          {/* Dark Mode Toggle */}
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              mr: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* User Avatar */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <Avatar sx={{ 
              width: 36, 
              height: 36,
              background: '#10B981',
              fontWeight: 600,
              fontSize: '1rem',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: '12px',
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 12px rgba(99, 102, 241, 0.15))',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E5E7EB' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {user?.email}
              </Typography>
            </Box>
            <MenuItem 
              onClick={() => {
                navigate('/app/profile');
                handleProfileMenuClose();
              }}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#F1F5F9',
                },
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" sx={{ color: '#6366F1' }} />
              </ListItemIcon>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem 
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: '#EF4444',
                '&:hover': {
                  backgroundColor: '#FEE2E2',
                },
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#EF4444' }} />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E5E7EB',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E5E7EB',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Navbar;

