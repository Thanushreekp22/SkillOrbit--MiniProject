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

  useEffect(() => {
    fetchReportData();
  }, [user]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [skillsRes, assessmentsRes, analysesRes] = await Promise.all([
        api.get(`/skills/user/${user._id}`),
        api.get(`/assessments/history`),
        api.get(`/analysis/history`)
      ]);
      
      setSkills(skillsRes.data.skills || []);
      setAssessments(assessmentsRes.data.assessments || []);
      setAnalyses(analysesRes.data.analyses || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
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
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthAssessments = assessments.filter(a => {
        const aDate = new Date(a.createdAt || a.date);
        return aDate.getMonth() === monthIndex;
      });
      
      const avgProf = skills.length > 0
        ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
        : 0;
      
      data.push({
        month: months[monthIndex],
        proficiency: avgProf,
        assessments: monthAssessments.length
      });
    }
    
    return data;
  };

  // Generate radar chart data from skills
  const getRadarData = () => {
    if (skills.length === 0) {
      return [];
    }
    return skills.slice(0, 8).map(skill => ({
      skill: skill.name,
      proficiency: skill.proficiency,
      score: assessments.find(a => a.skillId === skill._id || a.skillName === skill.name)?.score || skill.proficiency
    }));
  };

  // Generate skill performance table data
  const getSkillPerformance = () => {
    return skills.map(skill => {
      const skillAssessments = assessments.filter(a => a.skillId === skill._id || a.skill === skill.name);
      const avgScore = skillAssessments.length > 0
        ? Math.round(skillAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / skillAssessments.length)
        : skill.proficiency;
      
      return {
        skill: skill.name,
        proficiency: skill.proficiency,
        assessments: skillAssessments.length,
        avgScore: avgScore,
        trend: skill.proficiency >= 70 ? 'up' : skill.proficiency >= 50 ? 'stable' : 'down'
      };
    });
  };

  // Generate assessment history data
  const getAssessmentHistory = () => {
    return assessments.slice(0, 10).map(assessment => ({
      date: assessment.createdAt || assessment.date || new Date(),
      skill: assessment.skill || skills.find(s => s._id === assessment.skillId)?.name || 'Unknown',
      score: assessment.score || 0,
      time: assessment.timeTaken || assessment.duration || 'N/A',
      status: assessment.status || 'Completed'
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography>Loading reports...</Typography>
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h3" gutterBottom>
              Reports & Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive skill development insights
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Download Report">
              <span>
                <IconButton 
                  onClick={handleDownloadReport} 
                  color="primary"
                  disabled={downloading}
                >
                  {downloading ? <CircularProgress size={24} /> : <Download />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Email Report">
              <IconButton onClick={handleOpenEmailDialog} color="primary">
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint} color="primary">
                <Print />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="overview">Overview</MenuItem>
                <MenuItem value="skills">Skills Performance</MenuItem>
                <MenuItem value="assessments">Assessment History</MenuItem>
                <MenuItem value="progress">Progress Tracking</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
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
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Progress Trends
              </Typography>
              {monthlyProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="proficiency"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Avg Proficiency"
                    />
                    <Line
                      type="monotone"
                      dataKey="assessments"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Assessments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No progress data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills by Category
              </Typography>
              {categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No skills data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Skill Performance Radar */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Skill Performance Analysis
          </Typography>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
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
                <Radar
                  name="Assessment Score"
                  dataKey="score"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <Typography color="text.secondary">No skill performance data available</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detailed Skills Table */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Skill Performance
          </Typography>
          <Divider sx={{ my: 2 }} />
          {skillPerformance.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Skill</strong></TableCell>
                    <TableCell><strong>Proficiency</strong></TableCell>
                    <TableCell><strong>Assessments</strong></TableCell>
                    <TableCell><strong>Avg Score</strong></TableCell>
                    <TableCell><strong>Trend</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skillPerformance.map((skill, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{skill.skill}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={skill.proficiency}
                            sx={{ width: 100, height: 8, borderRadius: 4 }}
                            color={skill.proficiency >= 80 ? 'success' : skill.proficiency >= 60 ? 'warning' : 'error'}
                          />
                          <Typography variant="body2">{skill.proficiency}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{skill.assessments}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${skill.avgScore}%`}
                          size="small"
                          color={skill.avgScore >= 80 ? 'success' : skill.avgScore >= 60 ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        {skill.trend === 'up' && <TrendingUp color="success" />}
                        {skill.trend === 'down' && <TrendingDown color="error" />}
                        {skill.trend === 'stable' && <Typography variant="body2">—</Typography>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Typography color="text.secondary">No skill performance data available</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Assessment History */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Assessment History
          </Typography>
          <Divider sx={{ my: 2 }} />
          {assessmentHistory.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Skill</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessmentHistory.map((assessment, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{assessment.skill}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${assessment.score}%`}
                          size="small"
                          color={assessment.score >= 80 ? 'success' : assessment.score >= 60 ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{assessment.time}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<CheckCircle />}
                          label={assessment.status}
                          size="small"
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Typography color="text.secondary">No assessment history available</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onClose={handleCloseEmailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Email color="primary" />
            <Typography variant="h6">Email Progress Report</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {emailSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Report sent successfully! Check your inbox.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the email address where you'd like to receive your progress report.
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
                helperText={emailError}
                sx={{ mt: 1 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} disabled={emailSending}>
            Cancel
          </Button>
          {!emailSuccess && (
            <Button 
              onClick={handleSendEmail} 
              variant="contained" 
              disabled={emailSending}
              startIcon={emailSending ? <CircularProgress size={20} /> : <Email />}
            >
              {emailSending ? 'Sending...' : 'Send Email'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsEnhanced;
