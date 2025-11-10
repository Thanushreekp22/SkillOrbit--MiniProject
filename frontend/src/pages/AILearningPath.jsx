import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Card,
  CardContent,
  Grid,
  Autocomplete,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Psychology,
  ExpandMore,
  AutoAwesome,
  TrendingUp,
  School,
  CheckCircle,
  Timeline,
  EmojiObjects,
  Rocket,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { SKILLS_LIST } from '../data/skillsList';
import PageHeader from '../components/PageHeader';

const AILearningPath = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [targetRole, setTargetRole] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [learningPath, setLearningPath] = useState(null);

  const roles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Cloud Architect',
    'Mobile Developer',
    'Security Engineer',
    'Cloud Engineer',
    'Cyber Security Specialist',
    'AI/ML Engineer',
    'Data Analyst',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    checkAIStatus();
    fetchUserSkills();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await api.get('/learning-path/ai-status');
      setAiEnabled(response.data.aiEnabled);
      if (!response.data.aiEnabled) {
        toast.warning('AI service is not configured. Please add GROK_API_KEY to enable AI recommendations.');
      }
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiEnabled(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const response = await api.get(`/skills/user/${user._id}`);
      const skillsData = response.data.skills || response.data || [];
      setUserSkills(skillsData);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleGeneratePath = async () => {
    if (!aiEnabled) {
      toast.error('AI service is not available. Please configure GROK_API_KEY.');
      return;
    }

    if (selectedSkills.length === 0) {
      toast.warning('Please select at least one skill to focus on');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/learning-path/ai-generate', {
        selectedSkills,
        targetRole,
        currentLevel,
      });

      setLearningPath(response.data.learningPath);
      toast.success('AI Learning Path generated successfully!');
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast.error(error.response?.data?.message || 'Failed to generate learning path');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="AI-Powered Learning Path"
        subtitle="Get personalized learning recommendations powered by Grok AI"
        icon={<Psychology />}
      />

      {!aiEnabled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>AI Service Not Configured:</strong> To enable AI-powered recommendations, add your Grok API key to the backend .env file.
            Get your API key from <a href="https://console.x.ai/" target="_blank" rel="noopener noreferrer">https://console.x.ai/</a>
          </Typography>
        </Alert>
      )}

      {/* Configuration Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="primary" />
          Configure Your Learning Path
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Skills Selection */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={SKILLS_LIST}
              value={selectedSkills}
              onChange={(event, newValue) => setSelectedSkills(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills to Focus On"
                  placeholder="Select skills you want to learn or improve"
                  helperText="Choose the skills you want to focus on in your learning path"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
            />
          </Grid>

          {/* Target Role */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Target Role (Optional)</InputLabel>
              <Select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                label="Target Role (Optional)"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Current Level */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Current Experience Level</InputLabel>
              <Select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                label="Current Experience Level"
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Current Skills Summary */}
          {userSkills.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Your Current Skills ({userSkills.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {userSkills.map((skill) => (
                    <Chip
                      key={skill._id}
                      label={`${skill.name} (${skill.proficiency}%)`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Generate Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleGeneratePath}
              disabled={loading || !aiEnabled || selectedSkills.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <Rocket />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {loading ? 'Generating AI Learning Path...' : 'Generate AI Learning Path'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Learning Path Results */}
      {learningPath && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiObjects color="primary" />
            Your Personalized Learning Path
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            Generated on {new Date(learningPath.generatedAt).toLocaleString()}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Raw Response */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                '& strong': { fontWeight: 700 },
              }}
            >
              {learningPath.rawResponse}
            </Typography>
          </Box>

          {/* Structured Sections */}
          {learningPath.sections && Object.keys(learningPath.sections).length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Navigation
              </Typography>
              {Object.entries(learningPath.sections).map(([key, value]) => (
                <Accordion key={key}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{value}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* Info Cards */}
      {!learningPath && !loading && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Psychology color="primary" />
                  <Typography variant="h6">AI-Powered</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Leverages Grok AI to analyze your skills and provide personalized recommendations
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Timeline color="primary" />
                  <Typography variant="h6">Structured Path</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get a clear roadmap with phases, milestones, and timelines for each skill
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <School color="primary" />
                  <Typography variant="h6">Resources</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Receive curated learning resources, courses, and project ideas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AILearningPath;
