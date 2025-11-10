import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  LinearProgress,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  LightbulbOutlined,
  School,
  Assessment,
  ArrowForward,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AnalysisEnhanced = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const predefinedRoles = [
    'Full Stack Developer',
    'Data Scientist',
    'Cloud Engineer',
    'Mobile Developer',
    'AI/ML Engineer',
    'Cybersecurity Specialist',
    'DevOps Engineer',
    'Data Analyst',
  ];

  useEffect(() => {
    fetchAnalysisHistory();
    fetchAvailableRoles();
  }, []);

  const fetchAvailableRoles = async () => {
    try {
      const response = await api.get('/analysis/roles');
      setAvailableRoles(response.data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const response = await api.get('/analysis/history');
      setAnalysisHistory(response.data.analyses || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole) {
      toast.error('Please select a target role');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await api.post('/analysis/analyze', {
        userId: user._id,
        targetRole,
      });
      setAnalysisResult(response.data.analysis);
      toast.success('Analysis completed successfully!');
      fetchAnalysisHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewAnalysis = async (analysisId) => {
    setLoading(true);
    try {
      const response = await api.get(`/analysis/${analysisId}`);
      const analysis = response.data.analysis;
      
      // Transform the data to match the expected format
      setAnalysisResult({
        _id: analysis._id,
        targetRole: analysis.targetRole,
        readinessScore: analysis.readinessScore,
        totalGaps: analysis.gaps.filter(g => g.gapValue > 0).length,
        skillsAnalyzed: analysis.gaps.length,
        avgGapPercentage: Math.round(
          analysis.gaps.reduce((sum, g) => sum + (g.gapPercentage || 0), 0) / analysis.gaps.length
        ),
        overallCompletion: Math.round(
          analysis.gaps.reduce((sum, g) => sum + (g.completionPercentage || 0), 0) / analysis.gaps.length
        ),
        gaps: analysis.gaps,
        recommendations: analysis.recommendations
      });
      
      // Scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.info('Loaded previous analysis');
    } catch (error) {
      toast.error('Failed to load analysis details');
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'met':
        return 'success';
      case 'close':
        return 'warning';
      case 'gap':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'met':
        return <CheckCircle color="success" />;
      case 'close':
        return <Warning color="warning" />;
      case 'gap':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  // Prepare chart data
  const gapChartData = analysisResult?.gaps?.map(gap => ({
    skill: gap.skillName,
    current: gap.currentProficiency,
    required: gap.requiredProficiency,
    gap: gap.gapValue,
  })) || [];

  const radarData = analysisResult?.gaps?.slice(0, 6).map(gap => ({
    skill: gap.skillName,
    current: gap.currentProficiency,
    required: gap.requiredProficiency,
  })) || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          Skill Gap Analysis
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Identify gaps and get personalized recommendations for your career goals
        </Typography>
      </Box>

      {/* Analysis Form */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Analyze Your Skills
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Select a target role to see how your current skills match up
          </Typography>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                select
                fullWidth
                label="Target Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                helperText="Choose the role you're aiming for"
              >
                {predefinedRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAnalyze}
                disabled={analyzing || !targetRole}
                startIcon={analyzing ? <CircularProgress size={20} /> : <Assessment />}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Skills'}
              </Button>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>How it works:</strong> We compare your current skills against the requirements
              for your target role and identify areas for improvement.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <>
          {/* Readiness Score */}
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom textAlign="center">
                Analysis Results for {analysisResult.targetRole}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Readiness Score */}
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Readiness Score
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={analysisResult.readinessScore}
                        size={160}
                        thickness={5}
                        sx={{ color: getReadinessColor(analysisResult.readinessScore) }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant="h3" component="div" fontWeight="bold">
                          {analysisResult.readinessScore}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Overall Readiness
                    </Typography>
                  </Box>
                </Grid>

                {/* Gap Percentage */}
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Gap Percentage
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={analysisResult.avgGapPercentage || 0}
                        size={160}
                        thickness={5}
                        sx={{ color: '#f44336' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant="h3" component="div" fontWeight="bold" color="error">
                          {analysisResult.avgGapPercentage || 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Average Skill Gap
                    </Typography>
                  </Box>
                </Grid>

                {/* Completion Percentage */}
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Completion
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={analysisResult.overallCompletion || 0}
                        size={160}
                        thickness={5}
                        sx={{ color: '#4caf50' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
                          {analysisResult.overallCompletion || 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Requirements Met
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box textAlign="center" mt={3}>
                <Typography variant="body1" color="text.secondary">
                  {analysisResult.totalGaps === 0
                    ? '🎉 Congratulations! You meet all requirements!'
                    : `You have ${analysisResult.totalGaps} skill gap${analysisResult.totalGaps > 1 ? 's' : ''} to address`}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Charts */}
          <Grid container spacing={3} mb={4}>
            {/* Radar Chart */}
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skills Comparison
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Required"
                        dataKey="required"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Bar Chart */}
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Gap Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gapChartData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" fill="#8884d8" name="Current" />
                      <Bar dataKey="required" fill="#82ca9d" name="Required" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Skill Gaps Detail */}
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Detailed Skill Gaps
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {analysisResult.gaps.map((gap, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(gap.status)}
                          <Typography variant="subtitle1" fontWeight="bold">
                            {gap.skillName}
                          </Typography>
                        </Box>
                        <Chip
                          label={gap.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(gap.status)}
                        />
                      </Box>
                      
                      {/* Progress Bar */}
                      <Box mb={1}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            Current: {gap.currentProficiency}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Required: {gap.requiredProficiency}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={gap.completionPercentage || (gap.currentProficiency / gap.requiredProficiency) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                          color={getStatusColor(gap.status)}
                        />
                      </Box>
                      
                      {/* Gap Information */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {gap.gapValue > 0 ? (
                          <>
                            <Typography variant="body2" color="error" fontWeight="bold">
                              Gap: {gap.gapValue}% ({gap.gapPercentage || 0}% of requirement)
                            </Typography>
                            <Chip
                              label={`${gap.completionPercentage || 0}% Complete`}
                              size="small"
                              color={getStatusColor(gap.status)}
                              variant="outlined"
                            />
                          </>
                        ) : (
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            ✓ Requirement Met - 100% Complete
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <LightbulbOutlined sx={{ mr: 1, color: 'warning.main', fontSize: 32 }} />
                <Typography variant="h5">
                  Personalized Recommendations
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <List>
                {analysisResult.recommendations.map((rec, index) => (
                  <ListItem key={index} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.skillName}
                      secondary={rec.recommendation}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                    <Chip label={rec.priority} size="small" color="primary" />
                  </ListItem>
                ))}
              </List>
              <Box mt={3} textAlign="center">
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/app/learning-path')}
                >
                  View Learning Resources
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Previous Analyses
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {analysisHistory.slice(0, 3).map((analysis, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        elevation: 6,
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleViewAnalysis(analysis._id)}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {analysis.targetRole}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Readiness Score
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {analysis.readinessScore}%
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(analysis.analyzedAt).toLocaleDateString()}
                      </Typography>
                      <Chip 
                        label="View Details" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AnalysisEnhanced;
