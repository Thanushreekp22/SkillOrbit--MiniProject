import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
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
  TablePagination,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import { getMyActivity } from '../api/adminApi';
import { format } from 'date-fns';

const ActivityLog = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }
    setAdminData(JSON.parse(admin));
  }, [navigate]);

  const activityTypes = [
    { value: '', label: 'All Activities' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGIN_FAILED', label: 'Failed Login' },
    { value: 'CREATE_ADMIN', label: 'Create Admin' },
    { value: 'UPDATE_PROFILE', label: 'Update Profile' },
    { value: 'PASSWORD_CHANGED', label: 'Password Changed' },
    { value: 'PASSWORD_CHANGE_FAILED', label: 'Password Change Failed' },
    { value: 'ADMIN_ACTIVATED', label: 'Admin Activated' },
    { value: 'ADMIN_DEACTIVATED', label: 'Admin Deactivated' },
    { value: 'ADMIN_UNLOCKED', label: 'Admin Unlocked' },
    { value: 'ADD_QUESTION', label: 'Add Question' },
    { value: 'UPDATE_QUESTION', label: 'Update Question' },
    { value: 'DELETE_QUESTION', label: 'Delete Question' },
    { value: 'BULK_ADD_QUESTIONS', label: 'Bulk Add Questions' }
  ];

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filterAction) params.action = filterAction;
      
      const data = await getMyActivity(params);
      setActivities(data.activities || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch activity log:', err);
      setError(err.response?.data?.message || 'Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filterAction]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionColor = (action) => {
    if (action.includes('FAILED')) return 'error';
    if (action.includes('DELETE')) return 'warning';
    if (action.includes('LOGIN')) return 'success';
    if (action.includes('CREATE') || action.includes('ADD')) return 'info';
    if (action.includes('UPDATE')) return 'primary';
    return 'default';
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading && activities.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar title="Activity Log" adminData={adminData} />
      
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                My Activity Log
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track all your actions and activities in the admin panel
              </Typography>
            </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by Action"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                size="small"
              >
                {activityTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Activities: {activities.length}
              </Typography>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((activity, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Chip 
                          label={activity.action.replace(/_/g, ' ')}
                          color={getActionColor(activity.action)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {activity.details}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {activity.ipAddress || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatTimestamp(activity.timestamp)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={activities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
      </Box>
    </Box>
  );
};

export default ActivityLog;
