import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  School,
  PlayCircleOutline,
  MenuBook,
  Code,
  Assignment,
  Star,
  TrendingUp,
  CheckCircle,
  Bookmark,
  BookmarkBorder,
  OpenInNew,
  Timer,
  Psychology,
  AutoAwesome,
  EmojiObjects,
  Rocket,
  ExpandMore,
  Timeline,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { SKILLS_LIST } from '../data/skillsList';
import PageHeader from '../components/PageHeader';
import AILearningPathDisplay from '../components/AILearningPathDisplay';

const LearningPathUnified = () => {
  const { user } = useAuth();
  
  // Main tabs (Regular vs AI)
  const [mainTab, setMainTab] = useState(0);
  
  // Regular learning path state
  const [selectedSkill, setSelectedSkill] = useState('');
  const [resourceTab, setResourceTab] = useState(0);
  const [userSkills, setUserSkills] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  
  // AI learning path state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [selectedSkillsAI, setSelectedSkillsAI] = useState([]);
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

  // Comprehensive learning resources
  const learningResources = {
    JavaScript: {
      courses: [
        {
          title: 'JavaScript - The Complete Guide',
          platform: 'Udemy',
          instructor: 'Maximilian Schwarzmüller',
          duration: '52 hours',
          level: 'All Levels',
          rating: 4.6,
          students: '180k+',
          price: '$84.99',
          url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
        },
        {
          title: 'Modern JavaScript From The Beginning',
          platform: 'Udemy',
          instructor: 'Brad Traversy',
          duration: '21 hours',
          level: 'Beginner',
          rating: 4.7,
          students: '95k+',
          price: '$74.99',
          url: 'https://www.udemy.com/course/modern-javascript-from-the-beginning/',
        },
      ],
      documentation: [
        {
          title: 'MDN Web Docs - JavaScript',
          description: 'Comprehensive JavaScript documentation and tutorials',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        },
        {
          title: 'JavaScript.info',
          description: 'Modern JavaScript tutorial with interactive examples',
          url: 'https://javascript.info/',
        },
      ],
      projects: [
        {
          title: '30 JavaScript Projects',
          description: 'Build 30 projects in 30 days',
          difficulty: 'Intermediate',
          estimatedTime: '30 days',
        },
        {
          title: 'Todo App with LocalStorage',
          description: 'CRUD operations with browser storage',
          difficulty: 'Beginner',
          estimatedTime: '3 days',
        },
      ],
    },
    React: {
      courses: [
        {
          title: 'React - The Complete Guide',
          platform: 'Udemy',
          instructor: 'Maximilian Schwarzmüller',
          duration: '48 hours',
          level: 'All Levels',
          rating: 4.7,
          students: '200k+',
          price: '$84.99',
          url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        },
      ],
      documentation: [
        {
          title: 'React Official Documentation',
          description: 'Official React docs with interactive examples',
          url: 'https://react.dev/',
        },
      ],
      projects: [
        {
          title: 'E-commerce Store',
          description: 'Full-featured shopping cart with React',
          difficulty: 'Advanced',
          estimatedTime: '2 weeks',
        },
      ],
    },
    Python: {
      courses: [
        {
          title: 'Complete Python Bootcamp',
          platform: 'Udemy',
          instructor: 'Jose Portilla',
          duration: '22 hours',
          level: 'All Levels',
          rating: 4.6,
          students: '1.5M+',
          price: '$84.99',
          url: 'https://www.udemy.com/course/complete-python-bootcamp/',
        },
      ],
      documentation: [
        {
          title: 'Python Official Documentation',
          description: 'Comprehensive Python documentation',
          url: 'https://docs.python.org/3/',
        },
      ],
      projects: [
        {
          title: 'Web Scraper',
          description: 'Build a web scraping tool with BeautifulSoup',
          difficulty: 'Intermediate',
          estimatedTime: '1 week',
        },
      ],
    },
  };

  useEffect(() => {
    fetchUserSkills();
    checkAIStatus();
  }, []);

  const fetchUserSkills = async () => {
    try {
      const response = await api.get(`/skills/user/${user._id}`);
      const skillsData = response.data.skills || response.data || [];
      setUserSkills(skillsData);
      if (skillsData.length > 0 && !selectedSkill) {
        setSelectedSkill(skillsData[0].name);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const checkAIStatus = async () => {
    try {
      const response = await api.get('/learning-path/ai-status');
      setAiEnabled(response.data.aiEnabled);
      if (!response.data.aiEnabled) {
        console.log('AI service not configured');
      }
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiEnabled(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleGenerateAIPath = async () => {
    if (!aiEnabled) {
      toast.error('AI service is not available. Please configure GROK_API_KEY.');
      return;
    }

    if (selectedSkillsAI.length === 0) {
      toast.warning('Please select at least one skill to focus on');
      return;
    }

    setAiLoading(true);
    try {
      const response = await api.post('/learning-path/ai-generate', {
        selectedSkills: selectedSkillsAI,
        targetRole,
        currentLevel,
      });

      setLearningPath(response.data.learningPath);
      toast.success('AI Learning Path generated successfully!');
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast.error(error.response?.data?.message || 'Failed to generate learning path');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveLearningPath = async (pathData) => {
    try {
      await api.post('/learning-path/save', {
        title: pathData.title,
        selectedSkills: selectedSkillsAI,
        targetRole,
        currentLevel,
        aiResponse: pathData.rawResponse,
        sections: pathData.sections,
        resources: pathData.resources,
        isFavorite: pathData.isFavorite
      });

      toast.success('Learning path saved successfully!');
    } catch (error) {
      console.error('Error saving learning path:', error);
      toast.error('Failed to save learning path');
    }
  };

  const toggleBookmark = (resourceId) => {
    setBookmarked((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const currentResources = learningResources[selectedSkill] || {
    courses: [],
    documentation: [],
    projects: [],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Learning Path"
        subtitle="Discover curated resources and AI-powered recommendations"
        icon={<School />}
      />

      {/* Main Tabs: Regular vs AI */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={mainTab}
          onChange={(e, newValue) => setMainTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab
            icon={<School />}
            iconPosition="start"
            label="Curated Resources"
          />
          <Tab
            icon={<Psychology />}
            iconPosition="start"
            label="AI-Powered Path"
          />
        </Tabs>
      </Paper>

      {/* Regular Learning Path Tab */}
      {mainTab === 0 && (
        <Box>
          {/* Skill Selector */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select a Skill
            </Typography>
            <TextField
              select
              fullWidth
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              label="Choose Skill"
              helperText="Select a skill to view learning resources"
            >
              {userSkills.map((skill) => (
                <MenuItem key={skill._id} value={skill.name}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Typography>{skill.name}</Typography>
                    <Chip
                      label={`${skill.proficiency}%`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* Resource Tabs */}
          {selectedSkill && (
            <>
              <Tabs
                value={resourceTab}
                onChange={(e, newValue) => setResourceTab(newValue)}
                sx={{ mb: 3 }}
              >
                <Tab icon={<PlayCircleOutline />} label="Courses" />
                <Tab icon={<MenuBook />} label="Documentation" />
                <Tab icon={<Code />} label="Projects" />
              </Tabs>

              {/* Courses Tab */}
              {resourceTab === 0 && (
                <Grid container spacing={3}>
                  {currentResources.courses.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <PlayCircleOutline sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No courses available for this skill yet
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    currentResources.courses.map((course, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card elevation={3}>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                              <Typography variant="h6" fontWeight="bold">
                                {course.title}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => toggleBookmark(`course-${index}`)}
                              >
                                {bookmarked.includes(`course-${index}`) ? (
                                  <Bookmark color="primary" />
                                ) : (
                                  <BookmarkBorder />
                                )}
                              </IconButton>
                            </Box>
                            <Chip label={course.platform} size="small" color="primary" sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Instructor: {course.instructor}
                            </Typography>
                            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                              <Chip icon={<Timer />} label={course.duration} size="small" variant="outlined" />
                              <Chip label={course.level} size="small" variant="outlined" />
                              <Chip icon={<Star />} label={course.rating} size="small" color="warning" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {course.students} students • {course.price}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={<OpenInNew />}
                              href={course.url}
                              target="_blank"
                            >
                              View Course
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}

              {/* Documentation Tab */}
              {resourceTab === 1 && (
                <Grid container spacing={3}>
                  {currentResources.documentation.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <MenuBook sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No documentation available for this skill yet
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    currentResources.documentation.map((doc, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card elevation={3}>
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                              <MenuBook color="primary" />
                              <Typography variant="h6" fontWeight="bold">
                                {doc.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                              {doc.description}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              fullWidth
                              variant="outlined"
                              endIcon={<OpenInNew />}
                              href={doc.url}
                              target="_blank"
                            >
                              Read Documentation
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}

              {/* Projects Tab */}
              {resourceTab === 2 && (
                <Grid container spacing={3}>
                  {currentResources.projects.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Code sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No projects available for this skill yet
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    currentResources.projects.map((project, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card elevation={3}>
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                              <Code color="primary" />
                              <Typography variant="h6" fontWeight="bold">
                                {project.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                              {project.description}
                            </Typography>
                            <Box display="flex" gap={1}>
                              <Chip
                                label={project.difficulty}
                                size="small"
                                color={
                                  project.difficulty === 'Beginner'
                                    ? 'success'
                                    : project.difficulty === 'Intermediate'
                                    ? 'warning'
                                    : 'error'
                                }
                              />
                              <Chip label={project.estimatedTime} size="small" variant="outlined" />
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button fullWidth variant="contained" startIcon={<Assignment />}>
                              Start Project
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
            </>
          )}
        </Box>
      )}

      {/* AI-Powered Learning Path Tab */}
      {mainTab === 1 && (
        <Box>
          {!aiEnabled && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>AI Service Not Configured:</strong> To enable AI-powered recommendations, add your API key to the backend .env file.
                <br />
                <strong>Option 1 (Recommended):</strong> Groq Cloud - Get your API key from <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer">https://console.groq.com/</a>
                <br />
                <strong>Option 2:</strong> Grok AI (xAI) - Get your API key from <a href="https://console.x.ai/" target="_blank" rel="noopener noreferrer">https://console.x.ai/</a>
              </Typography>
            </Alert>
          )}

          {/* Configuration Form */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome color="primary" />
              Configure Your AI Learning Path
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Skills Selection */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={SKILLS_LIST}
                  value={selectedSkillsAI}
                  onChange={(event, newValue) => setSelectedSkillsAI(newValue)}
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
                  onClick={handleGenerateAIPath}
                  disabled={aiLoading || !aiEnabled || selectedSkillsAI.length === 0}
                  startIcon={aiLoading ? <CircularProgress size={20} /> : <Rocket />}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
                    },
                  }}
                >
                  {aiLoading ? 'Generating AI Learning Path...' : 'Generate AI Learning Path'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Learning Path Results */}
          {learningPath && (
            <AILearningPathDisplay 
              learningPath={learningPath}
              onSave={handleSaveLearningPath}
              isSaved={false}
            />
          )}

          {/* Info Cards */}
          {!learningPath && !aiLoading && (
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
        </Box>
      )}
    </Container>
  );
};

export default LearningPathUnified;
