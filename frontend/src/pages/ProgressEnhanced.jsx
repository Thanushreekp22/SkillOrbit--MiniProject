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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  EmojiEvents,
  Star,
  Assessment,
  School,
  Psychology,
  Whatshot,
  Flag,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProgressEnhanced = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSkills: 0,
    avgProficiency: 0,
    expertSkills: 0,
    assessmentsCompleted: 0,
    analysesCompleted: 0
  });

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user skills
      const skillsRes = await api.get(`/skills/user/${user._id}`);
      const userSkills = skillsRes.data.skills || [];
      setSkills(userSkills);

      // Fetch assessments
      let userAssessments = [];
      try {
        const assessmentsRes = await api.get(`/assessment/history`);
        userAssessments = assessmentsRes.data.assessments || [];
        setAssessments(userAssessments);
      } catch (err) {
        console.log('No assessments found or error fetching:', err.message);
        setAssessments([]);
      }

      // Fetch analyses
      let userAnalyses = [];
      try {
        const analysesRes = await api.get(`/analysis/history`);
        userAnalyses = analysesRes.data.analyses || [];
        setAnalyses(userAnalyses);
      } catch (err) {
        console.log('No analyses found or error fetching:', err.message);
        setAnalyses([]);
      }

      // Calculate stats
      const avgProf = userSkills.length > 0
        ? Math.round(userSkills.reduce((acc, s) => acc + s.proficiency, 0) / userSkills.length)
        : 0;
      
      setStats({
        totalSkills: userSkills.length,
        avgProficiency: avgProf,
        expertSkills: userSkills.filter(s => s.proficiency >= 80).length,
        assessmentsCompleted: userAssessments.length,
        analysesCompleted: userAnalyses.length
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate category distribution from real skills
  const getCategoryDistribution = () => {
    const categories = {};
    const colors = {
      'Frontend': '#8884d8',
      'Backend': '#82ca9d',
      'Database': '#ffc658',
      'DevOps': '#ff8042',
      'Cloud': '#a4de6c',
      'Mobile': '#d0ed57',
      'AI/ML': '#83a6ed',
      'Security': '#8dd1e1',
      'Testing': '#82ca9d',
      'Other': '#a4a4a4'
    };

    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return Object.keys(categories).map(cat => ({
      name: cat,
      value: categories[cat],
      color: colors[cat] || '#a4a4a4'
    }));
  };

  // Generate milestones from real data
  const getMilestones = () => {
    const milestones = [];

    // First skill added
    if (skills.length > 0) {
      const oldestSkill = skills.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      )[0];
      milestones.push({
        title: 'First Skill Added',
        description: `Added ${oldestSkill.name} to your portfolio`,
        date: oldestSkill.createdAt,
        icon: <Star />,
        color: 'primary',
      });
    }

    // First assessment
    if (assessments.length > 0) {
      const firstAssessment = assessments.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      )[0];
      milestones.push({
        title: 'First Assessment Completed',
        description: `Scored ${firstAssessment.score}% on ${firstAssessment.skillName}`,
        date: firstAssessment.createdAt,
        icon: <Assessment />,
        color: 'success',
      });
    }

    // Expert level achievements
    const expertSkills = skills.filter(s => s.proficiency >= 80);
    if (expertSkills.length > 0) {
      milestones.push({
        title: `${expertSkills.length} Skill${expertSkills.length > 1 ? 's' : ''} Mastered`,
        description: `Achieved expert level in ${expertSkills.map(s => s.name).join(', ')}`,
        date: new Date().toISOString(),
        icon: <EmojiEvents />,
        color: 'warning',
      });
    }

    // First analysis
    if (analyses.length > 0) {
      const firstAnalysis = analyses.sort((a, b) => 
        new Date(a.analyzedAt) - new Date(b.analyzedAt)
      )[0];
      milestones.push({
        title: 'First Gap Analysis',
        description: `Analyzed skills for ${firstAnalysis.targetRole}`,
        date: firstAnalysis.analyzedAt,
        icon: <Psychology />,
        color: 'info',
      });
    }

    // 50% proficiency milestone
    if (stats.avgProficiency >= 50) {
      milestones.push({
        title: 'Reached 50% Proficiency',
        description: `Average skill proficiency: ${stats.avgProficiency}%`,
        date: new Date().toISOString(),
        icon: <TrendingUp />,
        color: 'success',
      });
    }

    return milestones.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getAchievements = () => {
    return [
      { title: 'Quick Learner', description: 'Added 3 or more skills', icon: <Whatshot />, earned: stats.totalSkills >= 3 },
      { title: 'Assessment Master', description: 'Completed 5+ assessments', icon: <Assessment />, earned: stats.assessmentsCompleted >= 5 },
      { title: 'Full Stack', description: 'Master both frontend and backend', icon: <Psychology />, earned: skills.filter(s => s.category === 'Frontend').length > 0 && skills.filter(s => s.category === 'Backend').length > 0 },
      { title: 'Expert Level', description: 'Reach 80%+ in any skill', icon: <Star />, earned: stats.expertSkills > 0 },
      { title: 'Analyst', description: 'Complete a gap analysis', icon: <School />, earned: stats.analysesCompleted > 0 },
      { title: 'Goal Achiever', description: 'Reach 70%+ average proficiency', icon: <Flag />, earned: stats.avgProficiency >= 70 },
    ];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography>Loading progress data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          Progress Tracking
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Monitor your skill development journey
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Skills
                  </Typography>
                  <Typography variant="h3">
                    {stats.totalSkills}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    in portfolio
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <Star fontSize="large" />
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
                    Avg Proficiency
                  </Typography>
                  <Typography variant="h3">
                    {stats.avgProficiency}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    overall
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
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
                    Achievements
                  </Typography>
                  <Typography variant="h3">
                    {getAchievements().filter(a => a.earned).length}/{getAchievements().length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    unlocked
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <EmojiEvents fontSize="large" />
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
                    {stats.assessmentsCompleted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    completed
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Assessment fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Skills by Proficiency */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Skills by Proficiency
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skills.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="proficiency" fill="#8884d8" name="Proficiency %" />
                </BarChart>
              </ResponsiveContainer>
              {skills.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No skills added yet. Add skills to see your progress!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCategoryDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCategoryDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {skills.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No categories to display
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Milestones List */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Milestones & Achievements
          </Typography>
          <Divider sx={{ my: 2 }} />
          {getMilestones().length > 0 ? (
            <List>
              {getMilestones().map((milestone, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 2,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${milestone.color}.main` }}>
                        {milestone.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {milestone.title}
                          </Typography>
                          <Chip
                            label={new Date(milestone.date).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={milestone.description}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                Start your journey by adding skills and completing assessments to unlock milestones!
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} href="/app/skills">
                Add Your First Skill
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Achievements & Badges
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {getAchievements().map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={achievement.earned ? 3 : 1}
                  sx={{
                    p: 2,
                    opacity: achievement.earned ? 1 : 0.5,
                    border: achievement.earned ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar
                      sx={{
                        bgcolor: achievement.earned ? 'primary.main' : 'grey.400',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {achievement.title}
                      </Typography>
                      {achievement.earned && (
                        <Chip label="Unlocked" size="small" color="success" />
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProgressEnhanced;
