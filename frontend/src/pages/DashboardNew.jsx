import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Assessment,
  EmojiEvents,
  Add,
  Psychology,
  Speed,
  ArrowForward,
  Dashboard,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';

const DashboardNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [assessmentStats, setAssessmentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
      fetchAssessmentStats();
    }
  }, [user?._id]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/users/${user._id}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentStats = async () => {
    try {
      const response = await api.get('/assessment/stats');
      console.log('Assessment stats response:', response.data);
      setAssessmentStats(response.data);
    } catch (error) {
      console.error('Error fetching assessment stats:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  // Prepare data for charts
  const skillRadarData = dashboardData?.skills?.slice(0, 6).map(skill => ({
    skill: skill.name,
    proficiency: skill.proficiency,
    fullMark: 100
  })) || [];

  const categoryData = dashboardData?.skillsByCategory?.map(cat => ({
    category: cat._id,
    count: cat.count,
    avgProficiency: Math.round(cat.avgProficiency)
  })) || [];

  const assessmentTrendData = assessmentStats?.skillStats?.slice(0, 5).map(stat => ({
    skill: stat._id,
    avgScore: Math.round(stat.averageScore),
    bestScore: stat.bestScore,
    attempts: stat.totalAssessments
  })) || [];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={64} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${user?.name}! 👋`}
        subtitle="Here's your skill development overview and progress insights"
        icon={<Dashboard sx={{ fontSize: '2rem' }} />}
      />

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }} gutterBottom>
                    Total Skills
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                    {dashboardData?.totalSkills || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Psychology fontSize="large" sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }} gutterBottom>
                    Avg Proficiency
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                    {dashboardData?.averageProficiency || 0}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Speed fontSize="large" sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }} gutterBottom>
                    Assessments
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                    {assessmentStats?.overallStats?.totalAssessments || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Assessment fontSize="large" sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }} gutterBottom>
                    Avg Score
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                    {Math.round(assessmentStats?.overallStats?.averageScore || 0)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <EmojiEvents fontSize="large" sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Skill Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 600,
                  color: '#1E293B',
                }}
              >
                📊 Skill Proficiency Overview
              </Typography>
              {skillRadarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Proficiency"
                      dataKey="proficiency"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No skills added yet. Add your first skill to see the chart!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/app/skills')}
                    sx={{ mt: 2 }}
                  >
                    Add Skills
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills by Category
              </Typography>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Skill Count" />
                    <Bar dataKey="avgProficiency" fill="#82ca9d" name="Avg Proficiency" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No category data available yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assessment Performance */}
      {assessmentTrendData.length > 0 && (
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assessment Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={assessmentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#8884d8"
                  name="Average Score"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="bestScore"
                  stroke="#82ca9d"
                  name="Best Score"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Skills */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Your Skills
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => navigate('/app/skills')}
            >
              Manage Skills
            </Button>
          </Box>
          <Grid container spacing={2}>
            {dashboardData?.skills?.slice(0, 6).map((skill, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {skill.name}
                    </Typography>
                    <Chip
                      label={skill.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        Proficiency
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={skill.proficiency}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor:
                            skill.proficiency >= 80
                              ? 'success.main'
                              : skill.proficiency >= 50
                              ? 'warning.main'
                              : 'error.main',
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {(!dashboardData?.skills || dashboardData.skills.length === 0) && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" gutterBottom>
                You haven't added any skills yet.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/app/skills')}
                sx={{ mt: 2 }}
              >
                Add Your First Skill
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => navigate('/app/assessment')}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assessment />
                </Avatar>
                <Typography variant="h6">Take Assessment</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Test your knowledge and get objective skill evaluation
              </Typography>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <IconButton color="primary">
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => navigate('/app/analysis')}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6">Gap Analysis</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Identify skill gaps and get personalized recommendations
              </Typography>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <IconButton color="success">
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => navigate('/app/learning-path')}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Typography variant="h6">Learning Path</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Get curated learning resources for your skill development
              </Typography>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <IconButton color="info">
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardNew;
