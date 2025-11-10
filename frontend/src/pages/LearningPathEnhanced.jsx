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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
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
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LearningPathEnhanced = () => {
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [userSkills, setUserSkills] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);

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
          estimatedTime: '2-3 hours',
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
          rating: 4.6,
          students: '200k+',
          price: '$84.99',
          url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        },
        {
          title: 'Modern React with Redux',
          platform: 'Udemy',
          instructor: 'Stephen Grider',
          duration: '47 hours',
          level: 'Intermediate',
          rating: 4.6,
          students: '150k+',
          price: '$84.99',
          url: 'https://www.udemy.com/course/react-redux/',
        },
      ],
      documentation: [
        {
          title: 'Official React Documentation',
          description: 'Learn React from the official docs',
          url: 'https://react.dev/',
        },
        {
          title: 'React Patterns',
          description: 'Common React patterns and best practices',
          url: 'https://reactpatterns.com/',
        },
      ],
      projects: [
        {
          title: 'E-commerce Store',
          description: 'Full-featured shopping cart with React',
          difficulty: 'Advanced',
          estimatedTime: '2 weeks',
        },
        {
          title: 'Weather App',
          description: 'API integration with React hooks',
          difficulty: 'Beginner',
          estimatedTime: '1 day',
        },
      ],
    },
    'Node.js': {
      courses: [
        {
          title: 'The Complete Node.js Developer Course',
          platform: 'Udemy',
          instructor: 'Andrew Mead',
          duration: '35 hours',
          level: 'All Levels',
          rating: 4.7,
          students: '180k+',
          price: '$84.99',
          url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/',
        },
      ],
      documentation: [
        {
          title: 'Node.js Official Docs',
          description: 'Official Node.js documentation',
          url: 'https://nodejs.org/docs/',
        },
      ],
      projects: [
        {
          title: 'REST API with Express',
          description: 'Build a complete REST API',
          difficulty: 'Intermediate',
          estimatedTime: '1 week',
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
          description: 'Official Python docs and tutorials',
          url: 'https://docs.python.org/',
        },
      ],
      projects: [
        {
          title: 'Data Analysis with Pandas',
          description: 'Analyze real-world datasets',
          difficulty: 'Intermediate',
          estimatedTime: '1 week',
        },
      ],
    },
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const fetchUserSkills = async () => {
    try {
      const response = await api.get(`/skills/user/${user._id}`);
      const skills = response.data.skills || [];
      setUserSkills(skills);
      if (skills.length > 0) {
        setSelectedSkill(skills[0].name);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleBookmark = (resourceTitle) => {
    if (bookmarked.includes(resourceTitle)) {
      setBookmarked(bookmarked.filter(b => b !== resourceTitle));
      toast.info('Removed from bookmarks');
    } else {
      setBookmarked([...bookmarked, resourceTitle]);
      toast.success('Added to bookmarks');
    }
  };

  const currentResources = learningResources[selectedSkill] || {
    courses: [],
    documentation: [],
    projects: [],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          Learning Path
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Curated resources to master your skills
        </Typography>
      </Box>

      {/* Skill Selector */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select Skill to Learn"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              {userSkills.length === 0 ? (
                <MenuItem value="">No skills added yet</MenuItem>
              ) : (
                userSkills.map((skill) => (
                  <MenuItem key={skill._id} value={skill.name}>
                    {skill.name} - {skill.proficiency}% proficiency
                  </MenuItem>
                ))
              )}
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="React">React</MenuItem>
              <MenuItem value="Node.js">Node.js</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Paper elevation={1} sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {currentResources.courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Courses
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                <Typography variant="h5" color="success.main">
                  {currentResources.projects.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Projects
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab icon={<PlayCircleOutline />} label="Courses" />
          <Tab icon={<MenuBook />} label="Documentation" />
          <Tab icon={<Code />} label="Projects" />
        </Tabs>
      </Box>

      {/* Courses Tab */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {currentResources.courses.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No courses available for this skill yet
                </Typography>
              </Paper>
            </Grid>
          ) : (
            currentResources.courses.map((course, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleBookmark(course.title)}
                        color={bookmarked.includes(course.title) ? 'primary' : 'default'}
                      >
                        {bookmarked.includes(course.title) ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>

                    <Chip label={course.platform} size="small" color="primary" sx={{ mb: 2 }} />

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <School fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={course.instructor} secondary="Instructor" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Timer fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={course.duration} secondary="Duration" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUp fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={course.level} secondary="Level" />
                      </ListItem>
                    </List>

                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <Star sx={{ color: '#ffc107' }} />
                      <Typography variant="body2" fontWeight="bold">
                        {course.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({course.students} students)
                      </Typography>
                    </Box>

                    <Typography variant="h6" color="success.main" mt={2}>
                      {course.price}
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
      {selectedTab === 1 && (
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
      {selectedTab === 2 && (
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
    </Container>
  );
};

export default LearningPathEnhanced;
