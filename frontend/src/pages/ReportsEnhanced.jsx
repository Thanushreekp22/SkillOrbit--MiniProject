import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  MenuItem,
  TextField,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  Assessment,
  Download,
  Print,
  Share,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Psychology,
  EmojiEvents,
  School,
  Email,
  Speed,
  Star,
  Timeline,
  Assignment,
  Refresh,
} from '@mui/icons-material';
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ReportsEnhanced = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetchReportData();
    }
  }, [user]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching report data for user:', user._id);
      
      const [skillsRes, assessmentsRes, analysesRes] = await Promise.all([
        api.get(`/skills/user/${user._id}`),
        api.get(`/assessment/history`),
        api.get(`/analysis/history`)
      ]);
      
      const skillsData = skillsRes.data.skills || [];
      const assessmentsData = assessmentsRes.data.assessments || [];
      const analysesData = analysesRes.data.analyses || [];
      
      console.log('✅ Report data loaded:');
      console.log('  - Skills:', skillsData.length);
      console.log('  - Assessments:', assessmentsData.length);
      console.log('  - Analyses:', analysesData.length);
      console.log('  - Sample Assessment:', assessmentsData[0]);
      
      setSkills(skillsData);
      setAssessments(assessmentsData);
      setAnalyses(analysesData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Error fetching report data:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchReportData();
  };

  // Calculate overview data from real data
  const getOverviewData = () => {
    const avgProf = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0;
    
    const avgScore = assessments.length > 0
      ? Math.round(assessments.reduce((acc, a) => acc + (a.score || 0), 0) / assessments.length)
      : 0;

    return {
      totalSkills: skills.length,
      avgProficiency: avgProf,
      totalAssessments: assessments.length,
      avgScore: avgScore,
      totalAnalyses: analyses.length,
      expertSkills: skills.filter(s => s.proficiency >= 80).length,
    };
  };

  // Get category breakdown from real skills
  const getCategoryBreakdown = () => {
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

  // Generate monthly progress data from assessments
  const getMonthlyProgress = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthAssessments = assessments.filter(a => {
        const aDate = new Date(a.createdAt || a.date);
        return aDate.getMonth() === monthIndex && aDate.getFullYear() === year;
      });
      
      // Calculate average proficiency for that month based on assessments
      const avgScore = monthAssessments.length > 0
        ? Math.round(monthAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / monthAssessments.length)
        : 0;
      
      // Use overall skill proficiency as baseline if no assessments
      const avgProf = avgScore > 0 ? avgScore : (skills.length > 0
        ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
        : 0);
      
      data.push({
        month: months[monthIndex],
        proficiency: avgProf,
        assessments: monthAssessments.length,
        score: avgScore
      });
    }
    
    return data;
  };

  // Generate radar chart data from skills
  const getRadarData = () => {
    if (skills.length === 0) {
      return [];
    }
    return skills.slice(0, 8).map(skill => {
      const relatedAssessment = assessments.find(a => 
        a.skillId === skill._id || 
        a.skillName === skill.name ||
        (a.skillName && skill.name && a.skillName.toLowerCase() === skill.name.toLowerCase())
      );
      
      return {
        skill: skill.name.length > 15 ? skill.name.substring(0, 15) + '...' : skill.name,
        proficiency: skill.proficiency,
        score: relatedAssessment?.score || skill.proficiency
      };
    });
  };

  // Generate skill performance table data
  const getSkillPerformance = () => {
    return skills.map(skill => {
      const skillAssessments = assessments.filter(a => 
        a.skillId === skill._id || 
        a.skill === skill.name || 
        a.skillName === skill.name ||
        (a.skillName && skill.name && a.skillName.toLowerCase() === skill.name.toLowerCase())
      );
      const avgScore = skillAssessments.length > 0
        ? Math.round(skillAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / skillAssessments.length)
        : skill.proficiency;
      
      return {
        skill: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        assessments: skillAssessments.length,
        avgScore: avgScore,
        trend: skill.proficiency >= 70 ? 'up' : skill.proficiency >= 50 ? 'stable' : 'down'
      };
    });
  };

  // Generate assessment history data
  const getAssessmentHistory = () => {
    return assessments.slice(0, 10).map(assessment => {
      // Format time properly
      let timeDisplay = 'N/A';
      if (assessment.timeSpent) {
        const minutes = Math.floor(assessment.timeSpent / 60);
        const seconds = assessment.timeSpent % 60;
        timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      } else if (assessment.timeTaken) {
        timeDisplay = assessment.timeTaken;
      } else if (assessment.duration) {
        timeDisplay = assessment.duration;
      }

      return {
        date: assessment.createdAt || assessment.date || new Date(),
        skill: assessment.skillName || assessment.skill || skills.find(s => s._id === assessment.skillId)?.name || 'Unknown',
        score: assessment.score || 0,
        time: timeDisplay,
        status: assessment.status || 'completed'
      };
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="70vh"
        >
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ 
              color: '#667eea',
              mb: 3
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Loading your reports...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyzing your skills and progress data
          </Typography>
        </Box>
      </Container>
    );
  }

  const overviewData = getOverviewData();
  const categoryBreakdown = getCategoryBreakdown();
  const monthlyProgress = getMonthlyProgress();
  const radarData = getRadarData();
  const skillPerformance = getSkillPerformance();
  const assessmentHistory = getAssessmentHistory();

  // Debug log computed data
  console.log('📈 Computed Report Data:');
  console.log('  Overview:', overviewData);
  console.log('  Categories:', categoryBreakdown.length);
  console.log('  Monthly Progress:', monthlyProgress.length);
  console.log('  Radar Data:', radarData.length);
  console.log('  Skill Performance:', skillPerformance.length);
  console.log('  Assessment History:', assessmentHistory.length);

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const response = await api.get('/reports/download-pdf', {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `skillorbit-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenEmailDialog = () => {
    setEmailAddress(user?.email || '');
    setEmailSuccess(false);
    setEmailError('');
    setEmailDialogOpen(true);
  };

  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
    setEmailAddress('');
    setEmailSuccess(false);
    setEmailError('');
  };

  const handleSendEmail = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      setEmailSending(true);
      setEmailError('');
      
      const response = await api.post('/reports/email', {
        recipientEmail: emailAddress
      });
      
      setEmailSuccess(true);
      setTimeout(() => {
        handleCloseEmailDialog();
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError(error.response?.data?.message || 'Failed to send email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={3}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)',
                  color: 'white',
                }}
              >
                <Assessment sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
                  background: 'linear-gradient(90deg, #6366F1 0%, #0EA5E9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Reports & Analytics
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                maxWidth: '800px',
              }}
            >
              Track your progress and visualize your skill development journey
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={handleRefresh}
                disabled={loading}
                color="primary"
                sx={{ 
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download PDF Report">
              <span>
                <Button 
                  variant="contained"
                  startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <Download />}
                  onClick={handleDownloadReport}
                  disabled={downloading}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Email Report">
              <IconButton 
                onClick={handleOpenEmailDialog} 
                color="primary"
                sx={{ 
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Report">
              <IconButton 
                onClick={handlePrint} 
                color="primary"
                sx={{ 
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Print />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* No Data Alert */}
        {skills.length === 0 && assessments.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="body1" fontWeight={600} gutterBottom>
                  Welcome to Reports! 📊
                </Typography>
                <Typography variant="body2">
                  Start by adding skills and taking assessments to see your personalized reports and analytics.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => window.location.href = '/app/skills'}
                >
                  Add Skills
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => window.location.href = '/app/assessment'}
                >
                  Take Assessment
                </Button>
              </Stack>
            </Box>
          </Alert>
        )}

        {/* Overview Statistics Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={3}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Skills
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {overviewData.totalSkills}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                      Across all categories
                    </Typography>
                  </Box>
                  <School sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={3}
              sx={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Avg Proficiency
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {overviewData.avgProficiency}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                      Overall skill level
                    </Typography>
                  </Box>
                  <Speed sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={3}
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Assessments
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {overviewData.totalAssessments}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                      Avg score: {overviewData.avgScore}%
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={3}
              sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                height: '100%'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Expert Skills
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {overviewData.expertSkills}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                      80%+ proficiency
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
            borderRadius: 2
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="overview">📊 Overview</MenuItem>
                <MenuItem value="skills">🎯 Skills Performance</MenuItem>
                <MenuItem value="assessments">📝 Assessment History</MenuItem>
                <MenuItem value="progress">📈 Progress Tracking</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                sx={{ bgcolor: 'white' }}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Monthly Progress */}
        <Grid item xs={12} md={8}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Timeline color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Monthly Progress Trends
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {monthlyProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={monthlyProgress}>
                    <defs>
                      <linearGradient id="colorProficiency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38ef7d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38ef7d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#666"
                      style={{ fontSize: '12px' }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      iconType="circle"
                    />
                    <Area
                      type="monotone"
                      dataKey="proficiency"
                      stroke="#667eea"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorProficiency)"
                      name="Avg Proficiency (%)"
                    />
                    <Area
                      type="monotone"
                      dataKey="assessments"
                      stroke="#38ef7d"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAssessments)"
                      name="Assessments Taken"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box 
                  display="flex" 
                  flexDirection="column"
                  justifyContent="center" 
                  alignItems="center" 
                  height={320}
                  sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}
                >
                  <Timeline sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                  <Typography color="text.secondary">No progress data available yet</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complete assessments to see your trends
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <School color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Skills by Category
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box 
                  display="flex" 
                  flexDirection="column"
                  justifyContent="center" 
                  alignItems="center" 
                  height={320}
                  sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}
                >
                  <School sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                  <Typography color="text.secondary">No skills data available</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Add skills to see distribution
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Skill Performance Radar */}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Psychology color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Skill Performance Analysis
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Compare your self-assessed proficiency with actual assessment scores
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  style={{ fontSize: '12px', fill: '#666' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  style={{ fontSize: '10px' }}
                />
                <Radar
                  name="Self-Assessed Proficiency"
                  dataKey="proficiency"
                  stroke="#667eea"
                  fill="#667eea"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Radar
                  name="Assessment Score"
                  dataKey="score"
                  stroke="#38ef7d"
                  fill="#38ef7d"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column"
              justifyContent="center" 
              alignItems="center" 
              height={450}
              sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}
            >
              <Psychology sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography color="text.secondary" variant="h6">
                No skill performance data available yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', maxWidth: 400 }}>
                Take skill assessments to see how your self-assessment compares with actual test results
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detailed Skills Table */}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Speed color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Detailed Skill Performance
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comprehensive breakdown of all your skills with proficiency levels and assessment history
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {skillPerformance.length > 0 ? (
            <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Skill</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Proficiency</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Assessments</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Avg Score</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skillPerformance.map((skill, index) => (
                    <TableRow 
                      key={index} 
                      hover
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          transition: 'background-color 0.2s'
                        },
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {skill.skill}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={skill.category || 'Other'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={skill.proficiency}
                            sx={{ 
                              width: 120, 
                              height: 10, 
                              borderRadius: 5,
                              backgroundColor: '#e0e0e0'
                            }}
                            color={skill.proficiency >= 80 ? 'success' : skill.proficiency >= 60 ? 'warning' : 'error'}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {skill.proficiency}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={skill.assessments}
                          size="small"
                          sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${skill.avgScore}%`}
                          size="small"
                          color={skill.avgScore >= 80 ? 'success' : skill.avgScore >= 60 ? 'warning' : 'error'}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {skill.trend === 'up' && (
                          <Chip
                            icon={<TrendingUp />}
                            label="Rising"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                        {skill.trend === 'down' && (
                          <Chip
                            icon={<TrendingDown />}
                            label="Declining"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                        {skill.trend === 'stable' && (
                          <Chip
                            label="Stable"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column"
              justifyContent="center" 
              alignItems="center" 
              py={6}
              sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}
            >
              <Speed sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography color="text.secondary" variant="h6">
                No skill performance data available
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add skills and complete assessments to see detailed performance
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Assessment History */}
      <Card 
        elevation={3}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Assessment color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Recent Assessment History
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Track your recent assessment results and see your improvement over time
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {assessmentHistory.length > 0 ? (
            <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Skill</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Score</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Time Taken</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessmentHistory.map((assessment, index) => (
                    <TableRow 
                      key={index} 
                      hover
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          transition: 'background-color 0.2s'
                        },
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(assessment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {assessment.skill}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${assessment.score}%`}
                          size="small"
                          color={assessment.score >= 80 ? 'success' : assessment.score >= 60 ? 'warning' : 'error'}
                          sx={{ fontWeight: 600, minWidth: 60 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CheckCircle />}
                          label={assessment.status}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column"
              justifyContent="center" 
              alignItems="center" 
              py={6}
              sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}
            >
              <Assignment sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography color="text.secondary" variant="h6">
                No assessment history available yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Complete skill assessments to see your history here
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                onClick={() => window.location.href = '/app/assessment'}
              >
                Take Assessment
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog 
        open={emailDialogOpen} 
        onClose={handleCloseEmailDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            pb: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Email />
            <Typography variant="h6" fontWeight={600}>Email Progress Report</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {emailSuccess ? (
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: 28
                }
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                Report sent successfully!
              </Typography>
              <Typography variant="body2">
                Check your inbox for your comprehensive progress report.
              </Typography>
            </Alert>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Enter the email address where you'd like to receive your detailed progress report with charts and insights.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="your.email@example.com"
                disabled={emailSending}
                error={!!emailError}
                helperText={emailError || 'We\'ll send you a beautifully formatted report'}
                sx={{ 
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
                InputProps={{
                  startAdornment: <Email color="action" sx={{ mr: 1 }} />
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 2 }}>
          <Button 
            onClick={handleCloseEmailDialog} 
            disabled={emailSending}
            sx={{ borderRadius: 2 }}
          >
            {emailSuccess ? 'Close' : 'Cancel'}
          </Button>
          {!emailSuccess && (
            <Button 
              onClick={handleSendEmail} 
              variant="contained" 
              disabled={emailSending}
              startIcon={emailSending ? <CircularProgress size={20} color="inherit" /> : <Email />}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              {emailSending ? 'Sending...' : 'Send Report'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsEnhanced;
