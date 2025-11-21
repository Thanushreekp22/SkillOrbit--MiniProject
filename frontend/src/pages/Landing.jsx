import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  AppBar,
  Toolbar,
  LinearProgress,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Code,
  DataObject,
  Cloud,
  Security,
  Psychology,
  Rocket,
  Star,
  ArrowForward,
  School,
  Language,
} from '@mui/icons-material';
import SkillOrbitLogo from '../components/SkillOrbitLogo';

const Landing = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    skills: 0,
    domains: 0,
  });
  const [trendingData, setTrendingData] = useState({
    trendingDomains: [],
    hotSkills: [],
    loading: true,
  });

  // Trending domains data
  const trendingDomains = [
    {
      name: 'Artificial Intelligence & Machine Learning',
      icon: <Psychology />,
      growth: '+45%',
      color: '#FF6B6B',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Neural Networks'],
      jobs: '12.5k+ jobs',
    },
    {
      name: 'Cloud Computing & DevOps',
      icon: <Cloud />,
      growth: '+38%',
      color: '#4ECDC4',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      jobs: '8.3k+ jobs',
    },
    {
      name: 'Full Stack Development',
      icon: <Code />,
      growth: '+32%',
      color: '#45B7D1',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      jobs: '15.2k+ jobs',
    },
    {
      name: 'Cybersecurity',
      icon: <Security />,
      growth: '+41%',
      color: '#F7DC6F',
      skills: ['Ethical Hacking', 'Network Security', 'CISSP', 'Penetration Testing'],
      jobs: '6.7k+ jobs',
    },
    {
      name: 'Data Science & Analytics',
      icon: <DataObject />,
      growth: '+35%',
      color: '#BB8FCE',
      skills: ['SQL', 'R', 'Tableau', 'Power BI'],
      jobs: '9.1k+ jobs',
    },
    {
      name: 'Mobile Development',
      icon: <Rocket />,
      growth: '+29%',
      color: '#85C1E9',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      jobs: '7.4k+ jobs',
    },
  ];

  // Hot skills data
  const hotSkills = [
    { name: 'ChatGPT & AI Tools', demand: 95, salary: '$120k+' },
    { name: 'React.js', demand: 92, salary: '$95k+' },
    { name: 'Python', demand: 89, salary: '$105k+' },
    { name: 'AWS Cloud', demand: 87, salary: '$110k+' },
    { name: 'Docker', demand: 84, salary: '$100k+' },
    { name: 'Node.js', demand: 82, salary: '$90k+' },
    { name: 'Kubernetes', demand: 79, salary: '$115k+' },
    { name: 'TypeScript', demand: 77, salary: '$85k+' },
  ];

  // Fetch trending data from API
  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiBaseUrl}/trending`);
        const data = await response.json();
        
        setTrendingData({
          trendingDomains: data.trendingDomains || trendingDomains,
          hotSkills: data.hotSkills || hotSkills,
          loading: false,
        });

        // Animate stats with real data
        const targets = {
          users: data.stats?.users || 25000,
          skills: data.stats?.skills || 500,
          domains: data.stats?.domains || 50,
        };
        
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;

        const intervals = Object.keys(targets).map(key => {
          const target = targets[key];
          const increment = target / steps;
          let current = 0;

          return setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(intervals.find(interval => interval === this));
            }
            setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
          }, stepTime);
        });

        return () => intervals.forEach(clearInterval);
      } catch (error) {
        console.error('Error fetching trending data:', error);
        // Use fallback data
        setTrendingData({
          trendingDomains,
          hotSkills,
          loading: false,
        });
        
        // Animate with fallback stats
        const targets = { users: 25000, skills: 500, domains: 50 };
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;

        const intervals = Object.keys(targets).map(key => {
          const target = targets[key];
          const increment = target / steps;
          let current = 0;

          return setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(intervals.find(interval => interval === this));
            }
            setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
          }, stepTime);
        });
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: '#6366F1',
          py: 0.5,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <SkillOrbitLogo variant="light" size="small" withText={true} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/admin/login')}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.5)',
                  },
                }}
              >
                Admin
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  bgcolor: 'white',
                  color: '#6366F1',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box textAlign="center" mb={{ xs: 4, md: 6 }} px={{ xs: 2, md: 4 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem', lg: '4rem' },
              background: '#6366F1',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Master Skills.
            <br />
            Shape Future.
          </Typography>
          <Typography 
            variant="h4" 
            color="text.secondary" 
            gutterBottom 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              fontWeight: 400,
              maxWidth: '900px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover trending domains, analyze skill gaps, and accelerate your career growth with AI-powered insights
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForward />}
              onClick={() => navigate('/register')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: '#6366F1',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<School />}
              onClick={() => navigate('/login')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                borderWidth: '2px',
                borderColor: '#6366F1',
                color: '#6366F1',
                '&:hover': {
                  borderWidth: '2px',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Skills
            </Button>
          </Box>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 }, justifyContent: 'center', mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                borderRadius: '20px',
                border: '2px solid #E5E7EB',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                  borderColor: '#6366F1',
                },
              }}
            >
              <Typography 
                variant="h2" 
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 800,
                  background: '#6366F1',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                {animatedStats.users.toLocaleString()}+
              </Typography>
              <Typography variant="h5" color="text.secondary" fontWeight={500}>
                Active Learners
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Trending Domains Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box textAlign="center" mb={4}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <TrendingUp sx={{ mr: 2, color: '#6366F1', fontSize: 48 }} />
              <Typography 
                variant="h2" 
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Trending Domains 2025
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Explore the most in-demand career paths and master the skills that matter
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {(trendingData.trendingDomains.length > 0 ? trendingData.trendingDomains : trendingDomains).map((domain, index) => {
              // Add icons for dynamic data
              const domainIcons = {
                'Artificial Intelligence & Machine Learning': <Psychology />,
                'Cloud Computing & DevOps': <Cloud />,
                'Full Stack Development': <Code />,
                'Cybersecurity': <Security />,
                'Data Science & Analytics': <DataObject />,
                'Mobile Development': <Rocket />,
              };
              const domainColors = {
                'Artificial Intelligence & Machine Learning': '#FF6B6B',
                'Cloud Computing & DevOps': '#4ECDC4',
                'Full Stack Development': '#45B7D1',
                'Cybersecurity': '#F7DC6F',
                'Data Science & Analytics': '#BB8FCE',
                'Mobile Development': '#85C1E9',
              };
              
              // Map domain names to URL slugs
              const domainSlugMap = {
                'Artificial Intelligence & Machine Learning': 'ai-ml',
                'Cloud Computing & DevOps': 'cloud-devops',
                'Full Stack Development': 'fullstack',
                'Cybersecurity': 'cybersecurity',
                'Data Science & Analytics': 'data-science',
                'Mobile Development': 'mobile-dev',
              };
              const domainSlug = domainSlugMap[domain.name] || 'fullstack';
              
              return (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card 
                  elevation={4}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(`/domain/${domainSlug}`);
                  }}
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: domain.color || domainColors[domain.name] || '#45B7D1', mr: 2 }}>
                        {domain.icon || domainIcons[domain.name] || <Code />}
                      </Avatar>
                      <Box>
                        <Chip 
                          label={domain.growth} 
                          color="success" 
                          size="small"
                          icon={<TrendingUp />}
                        />
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {domain.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {domain.jobs}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Hot Skills:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {domain.skills.map((skill, skillIndex) => (
                          <Chip 
                            key={skillIndex}
                            label={skill} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Hot Skills Section */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box textAlign="center" mb={6}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Star sx={{ mr: 2, color: '#F59E0B', fontSize: 48 }} />
              <Typography 
                variant="h2" 
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Most In-Demand Skills
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Master these high-value skills and boost your earning potential
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {(trendingData.hotSkills.length > 0 ? trendingData.hotSkills : hotSkills).map((skill, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {skill.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Avg. Salary: {skill.salary}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Demand</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {skill.demand}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.demand} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: skill.demand > 85 ? 'success.main' : 
                                   skill.demand > 75 ? 'warning.main' : 'info.main'
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper 
          elevation={4}
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 4,
            background: '#667eea',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Boost Your Career?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of professionals tracking their skills and closing gaps
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center">
            © 2025 SkillOrbit. Built for the future of learning.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;

