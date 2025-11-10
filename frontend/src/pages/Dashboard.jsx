import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Assessment,
  School,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSkills: 0,
    masteredSkills: 0,
    inProgressSkills: 0,
    averageProficiency: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/users/${user._id}/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Here's your skill development overview
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Skills"
            value={stats.totalSkills}
            icon={<Psychology />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mastered Skills"
            value={stats.masteredSkills}
            icon={<TrendingUp />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgressSkills}
            icon={<School />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Proficiency"
            value={`${stats.averageProficiency}%`}
            icon={<Assessment />}
            color="info.main"
          />
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skill Development Progress
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">Overall Progress</Typography>
                <Typography variant="body2">{stats.averageProficiency}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.averageProficiency} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="textSecondary">
                You have {stats.totalSkills} skills in your portfolio. 
                {stats.masteredSkills > 0 && ` You've mastered ${stats.masteredSkills} skills!`}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Proficiency
                  </Typography>
                  <Typography variant="h3">
                    {Math.round(dashboardData?.avgProficiency || 0)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <Speed fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Assessments
                  </Typography>
                  <Typography variant="h3">
                    {assessmentStats?.overallStats?.totalAssessments || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Assessment fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Score
                  </Typography>
                  <Typography variant="h3">
                    {Math.round(assessmentStats?.overallStats?.averageScore || 0)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <EmojiEvents fontSize="large" />
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
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Proficiency Overview
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
