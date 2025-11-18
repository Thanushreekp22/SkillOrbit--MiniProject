import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Work,
  Add,
  CheckCircle,
  Cancel,
  TrendingUp,
  Assessment,
  School,
  Info,
  Edit,
  Delete,
  Psychology,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RolesEnhanced = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Predefined roles with requirements
  const predefinedRoles = [
    {
      title: 'Full Stack Developer',
      description: 'Build complete web applications from frontend to backend',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'JavaScript', proficiency: 80 },
        { name: 'React', proficiency: 75 },
        { name: 'Node.js', proficiency: 75 },
        { name: 'MongoDB', proficiency: 70 },
        { name: 'REST APIs', proficiency: 70 },
      ],
      salary: '$80k - $120k',
      demand: 'High',
    },
    {
      title: 'Frontend Developer',
      description: 'Create beautiful and responsive user interfaces',
      level: 'Junior-Mid',
      requiredSkills: [
        { name: 'HTML/CSS', proficiency: 85 },
        { name: 'JavaScript', proficiency: 80 },
        { name: 'React', proficiency: 80 },
        { name: 'TypeScript', proficiency: 70 },
        { name: 'UI/UX Design', proficiency: 65 },
      ],
      salary: '$60k - $100k',
      demand: 'Very High',
    },
    {
      title: 'Backend Developer',
      description: 'Design and implement server-side logic and databases',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'Node.js', proficiency: 85 },
        { name: 'Python', proficiency: 75 },
        { name: 'MongoDB', proficiency: 80 },
        { name: 'SQL', proficiency: 75 },
        { name: 'REST APIs', proficiency: 80 },
      ],
      salary: '$75k - $115k',
      demand: 'High',
    },
    {
      title: 'DevOps Engineer',
      description: 'Automate and streamline development operations',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'Docker', proficiency: 85 },
        { name: 'Kubernetes', proficiency: 75 },
        { name: 'AWS', proficiency: 80 },
        { name: 'CI/CD', proficiency: 80 },
        { name: 'Linux', proficiency: 75 },
      ],
      salary: '$90k - $140k',
      demand: 'Very High',
    },
    {
      title: 'Data Scientist',
      description: 'Extract insights from data using ML and statistics',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'Python', proficiency: 90 },
        { name: 'Machine Learning', proficiency: 85 },
        { name: 'SQL', proficiency: 80 },
        { name: 'Statistics', proficiency: 85 },
        { name: 'Data Visualization', proficiency: 75 },
      ],
      salary: '$95k - $150k',
      demand: 'Very High',
    },
    {
      title: 'Cloud Architect',
      description: 'Design and manage cloud infrastructure solutions',
      level: 'Senior',
      requiredSkills: [
        { name: 'AWS', proficiency: 90 },
        { name: 'Azure', proficiency: 80 },
        { name: 'Kubernetes', proficiency: 85 },
        { name: 'Terraform', proficiency: 80 },
        { name: 'Networking', proficiency: 75 },
      ],
      salary: '$110k - $170k',
      demand: 'High',
    },
    {
      title: 'Mobile Developer',
      description: 'Build native and cross-platform mobile applications',
      level: 'Mid',
      requiredSkills: [
        { name: 'React Native', proficiency: 80 },
        { name: 'JavaScript', proficiency: 80 },
        { name: 'Mobile UI/UX', proficiency: 75 },
        { name: 'REST APIs', proficiency: 70 },
        { name: 'Firebase', proficiency: 65 },
      ],
      salary: '$70k - $110k',
      demand: 'High',
    },
    {
      title: 'Security Engineer',
      description: 'Protect systems and data from security threats',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'Cybersecurity', proficiency: 90 },
        { name: 'Network Security', proficiency: 85 },
        { name: 'Penetration Testing', proficiency: 80 },
        { name: 'Linux', proficiency: 75 },
        { name: 'Python', proficiency: 70 },
      ],
      salary: '$85k - $135k',
      demand: 'Very High',
    },
    {
      title: 'Cloud Engineer',
      description: 'Build and maintain scalable cloud infrastructure',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'AWS', proficiency: 85 },
        { name: 'Docker', proficiency: 80 },
        { name: 'Kubernetes', proficiency: 80 },
        { name: 'Terraform', proficiency: 75 },
        { name: 'CI/CD', proficiency: 75 },
      ],
      salary: '$85k - $130k',
      demand: 'Very High',
    },
    {
      title: 'Cyber Security Specialist',
      description: 'Identify and mitigate security vulnerabilities and threats',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'Cybersecurity', proficiency: 90 },
        { name: 'Ethical Hacking', proficiency: 85 },
        { name: 'OWASP', proficiency: 80 },
        { name: 'Security Auditing', proficiency: 80 },
        { name: 'Encryption', proficiency: 75 },
      ],
      salary: '$90k - $145k',
      demand: 'Very High',
    },
    {
      title: 'AI/ML Engineer',
      description: 'Develop and deploy artificial intelligence and machine learning models',
      level: 'Mid-Senior',
      requiredSkills: [
        { name: 'Python', proficiency: 90 },
        { name: 'TensorFlow', proficiency: 85 },
        { name: 'Machine Learning', proficiency: 90 },
        { name: 'Deep Learning', proficiency: 80 },
        { name: 'PyTorch', proficiency: 75 },
      ],
      salary: '$100k - $160k',
      demand: 'Very High',
    },
    {
      title: 'Data Analyst',
      description: 'Analyze data to provide actionable business insights',
      level: 'Junior-Mid',
      requiredSkills: [
        { name: 'SQL', proficiency: 85 },
        { name: 'Python', proficiency: 75 },
        { name: 'Data Visualization', proficiency: 80 },
        { name: 'Excel', proficiency: 80 },
        { name: 'Tableau', proficiency: 70 },
      ],
      salary: '$60k - $95k',
      demand: 'High',
    },
  ];

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const fetchUserSkills = async () => {
    try {
      const response = await api.get(`/skills/user/${user._id}`);
      setUserSkills(response.data.skills || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatch = (role) => {
    if (userSkills.length === 0) return 0;

    const userSkillMap = {};
    userSkills.forEach(skill => {
      userSkillMap[skill.name.toLowerCase()] = skill.proficiency;
    });

    let totalMatch = 0;
    let skillsMatched = 0;

    role.requiredSkills.forEach(reqSkill => {
      const userProf = userSkillMap[reqSkill.name.toLowerCase()] || 0;
      const matchPercentage = Math.min((userProf / reqSkill.proficiency) * 100, 100);
      totalMatch += matchPercentage;
      skillsMatched++;
    });

    return skillsMatched > 0 ? Math.round(totalMatch / skillsMatched) : 0;
  };

  const getMatchColor = (match) => {
    if (match >= 80) return 'success';
    if (match >= 60) return 'warning';
    return 'error';
  };

  const getDemandColor = (demand) => {
    if (demand === 'Very High') return 'error';
    if (demand === 'High') return 'warning';
    return 'info';
  };

  const handleViewDetails = (role) => {
    setSelectedRole(role);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
  };

  const handleAnalyzeGap = (role) => {
    navigate('/app/analysis', { state: { targetRole: role.title } });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" gutterBottom>
          Career Roles & Opportunities
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore roles and see how your skills match up
        </Typography>
      </Box>

      {/* Info Alert */}
      {userSkills.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Add your skills first!</strong> Go to the Skills page to add your skills and see
            personalized role matches.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate('/app/skills')}
            sx={{ mt: 1 }}
          >
            Add Skills
          </Button>
        </Alert>
      )}

      {/* Stats Summary */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {predefinedRoles.length}
            </Typography>
            <Typography color="text.secondary">Available Roles</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {predefinedRoles.filter(r => calculateMatch(r) >= 80).length}
            </Typography>
            <Typography color="text.secondary">Strong Matches</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {predefinedRoles.filter(r => getDemandColor(r.demand) === 'error').length}
            </Typography>
            <Typography color="text.secondary">High Demand</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Roles Grid */}
      <Grid container spacing={3}>
        {predefinedRoles.map((role, index) => {
          const matchPercentage = calculateMatch(role);
          return (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Work color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {role.title}
                      </Typography>
                    </Box>
                    <Chip
                      label={role.demand}
                      size="small"
                      color={getDemandColor(role.demand)}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {role.description}
                  </Typography>

                  {/* Level and Salary */}
                  <Box display="flex" gap={1} mb={2}>
                    <Chip label={role.level} size="small" variant="outlined" />
                    <Chip label={role.salary} size="small" variant="outlined" color="success" />
                  </Box>

                  {/* Match Percentage */}
                  {userSkills.length > 0 && (
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight="bold">
                          Your Match
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={`${getMatchColor(matchPercentage)}.main`}>
                          {matchPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={matchPercentage}
                        color={getMatchColor(matchPercentage)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  {/* Required Skills Preview */}
                  <Typography variant="body2" fontWeight="bold" mb={1}>
                    Key Skills Required:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {role.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {role.requiredSkills.length > 3 && (
                      <Chip
                        label={`+${role.requiredSkills.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<Info />}
                    onClick={() => handleViewDetails(role)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Assessment />}
                    onClick={() => handleAnalyzeGap(role)}
                    color="primary"
                  >
                    Analyze Gap
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Role Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedRole && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                <Work color="primary" />
                {selectedRole.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box mb={3}>
                <Typography variant="body1" paragraph>
                  {selectedRole.description}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={selectedRole.level} variant="outlined" />
                  <Chip label={selectedRole.salary} variant="outlined" color="success" />
                  <Chip label={`Demand: ${selectedRole.demand}`} color={getDemandColor(selectedRole.demand)} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Required Skills & Proficiency Levels
              </Typography>
              <List>
                {selectedRole.requiredSkills.map((skill, idx) => {
                  const userSkill = userSkills.find(
                    s => s.name.toLowerCase() === skill.name.toLowerCase()
                  );
                  const userProf = userSkill?.proficiency || 0;
                  const hasSkill = userProf >= skill.proficiency;

                  return (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        {hasSkill ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={skill.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              Required: {skill.proficiency}%
                              {userProf > 0 && ` | Your Level: ${userProf}%`}
                            </Typography>
                            {userProf > 0 && (
                              <LinearProgress
                                variant="determinate"
                                value={(userProf / skill.proficiency) * 100}
                                sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                                color={hasSkill ? 'success' : 'error'}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>

              {userSkills.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Your overall match: <strong>{calculateMatch(selectedRole)}%</strong>
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                startIcon={<Assessment />}
                onClick={() => {
                  handleCloseDialog();
                  handleAnalyzeGap(selectedRole);
                }}
              >
                Analyze Skill Gap
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default RolesEnhanced;
