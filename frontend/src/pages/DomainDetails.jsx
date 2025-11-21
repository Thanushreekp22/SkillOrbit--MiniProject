import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  TrendingUp,
  School,
  Work,
  Code,
  Psychology,
  Cloud,
  Security,
  DataObject,
  Rocket,
  Star,
  Timeline,
  EmojiEvents,
} from '@mui/icons-material';

const DomainDetails = () => {
  const { domainName } = useParams();
  const navigate = useNavigate();

  // Comprehensive domain data
  const domainData = {
    'ai-ml': {
      name: 'Artificial Intelligence & Machine Learning',
      icon: <Psychology />,
      color: '#FF6B6B',
      growth: '+45%',
      jobs: '12,500+',
      avgSalary: '$120k - $180k',
      description: 'AI and ML are revolutionizing industries by enabling machines to learn from data and make intelligent decisions. This domain covers everything from neural networks to natural language processing.',
      skills: [
        { name: 'Python', level: 'Essential', proficiency: 95 },
        { name: 'TensorFlow', level: 'Essential', proficiency: 90 },
        { name: 'PyTorch', level: 'Essential', proficiency: 88 },
        { name: 'Neural Networks', level: 'Core', proficiency: 85 },
        { name: 'Deep Learning', level: 'Core', proficiency: 82 },
        { name: 'NLP', level: 'Advanced', proficiency: 80 },
        { name: 'Computer Vision', level: 'Advanced', proficiency: 78 },
        { name: 'Scikit-learn', level: 'Intermediate', proficiency: 75 },
      ],
      learningPath: [
        'Master Python programming fundamentals',
        'Learn statistics and linear algebra',
        'Understand machine learning algorithms',
        'Practice with TensorFlow and PyTorch',
        'Build neural network projects',
        'Explore NLP and Computer Vision',
        'Work on real-world AI projects',
      ],
      careerRoles: [
        { title: 'ML Engineer', salary: '$130k - $200k', demand: 'Very High' },
        { title: 'Data Scientist', salary: '$120k - $180k', demand: 'Very High' },
        { title: 'AI Research Scientist', salary: '$150k - $250k', demand: 'High' },
        { title: 'NLP Engineer', salary: '$125k - $190k', demand: 'High' },
      ],
      topCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'OpenAI', 'Tesla'],
      certifications: [
        'Google Professional ML Engineer',
        'AWS Certified Machine Learning',
        'TensorFlow Developer Certificate',
        'Deep Learning Specialization (Coursera)',
      ],
    },
    'cloud-devops': {
      name: 'Cloud Computing & DevOps',
      icon: <Cloud />,
      color: '#4ECDC4',
      growth: '+38%',
      jobs: '8,300+',
      avgSalary: '$110k - $160k',
      description: 'Cloud Computing and DevOps enable organizations to build, deploy, and scale applications efficiently. Master cloud platforms, containerization, and CI/CD pipelines.',
      skills: [
        { name: 'AWS', level: 'Essential', proficiency: 92 },
        { name: 'Docker', level: 'Essential', proficiency: 90 },
        { name: 'Kubernetes', level: 'Essential', proficiency: 88 },
        { name: 'Terraform', level: 'Core', proficiency: 85 },
        { name: 'Jenkins', level: 'Core', proficiency: 82 },
        { name: 'Azure', level: 'Advanced', proficiency: 80 },
        { name: 'CI/CD', level: 'Core', proficiency: 87 },
        { name: 'Linux', level: 'Essential', proficiency: 90 },
      ],
      learningPath: [
        'Learn Linux fundamentals',
        'Master cloud platforms (AWS/Azure)',
        'Understand containerization with Docker',
        'Learn Kubernetes orchestration',
        'Implement CI/CD pipelines',
        'Practice Infrastructure as Code',
        'Build automated deployment systems',
      ],
      careerRoles: [
        { title: 'DevOps Engineer', salary: '$115k - $170k', demand: 'Very High' },
        { title: 'Cloud Architect', salary: '$140k - $200k', demand: 'High' },
        { title: 'Site Reliability Engineer', salary: '$130k - $190k', demand: 'Very High' },
        { title: 'Platform Engineer', salary: '$120k - $180k', demand: 'High' },
      ],
      topCompanies: ['Amazon', 'Microsoft', 'Google', 'Netflix', 'Uber', 'Airbnb'],
      certifications: [
        'AWS Solutions Architect',
        'Certified Kubernetes Administrator',
        'Azure DevOps Engineer Expert',
        'Docker Certified Associate',
      ],
    },
    'fullstack': {
      name: 'Full Stack Development',
      icon: <Code />,
      color: '#45B7D1',
      growth: '+32%',
      jobs: '15,200+',
      avgSalary: '$95k - $150k',
      description: 'Full Stack Development encompasses both frontend and backend technologies, enabling you to build complete web applications from scratch.',
      skills: [
        { name: 'React', level: 'Essential', proficiency: 93 },
        { name: 'Node.js', level: 'Essential', proficiency: 91 },
        { name: 'MongoDB', level: 'Core', proficiency: 88 },
        { name: 'TypeScript', level: 'Core', proficiency: 86 },
        { name: 'Express.js', level: 'Essential', proficiency: 89 },
        { name: 'PostgreSQL', level: 'Advanced', proficiency: 84 },
        { name: 'REST APIs', level: 'Essential', proficiency: 92 },
        { name: 'Git', level: 'Essential', proficiency: 90 },
      ],
      learningPath: [
        'Master HTML, CSS, and JavaScript',
        'Learn React for frontend development',
        'Understand Node.js and Express',
        'Work with databases (MongoDB/PostgreSQL)',
        'Build RESTful APIs',
        'Implement authentication and security',
        'Deploy full-stack applications',
      ],
      careerRoles: [
        { title: 'Full Stack Developer', salary: '$100k - $160k', demand: 'Very High' },
        { title: 'Frontend Developer', salary: '$90k - $140k', demand: 'Very High' },
        { title: 'Backend Developer', salary: '$95k - $150k', demand: 'High' },
        { title: 'Software Engineer', salary: '$110k - $170k', demand: 'Very High' },
      ],
      topCompanies: ['Meta', 'Google', 'Amazon', 'Shopify', 'Stripe', 'Vercel'],
      certifications: [
        'Meta Frontend Developer',
        'AWS Certified Developer',
        'MongoDB Certified Developer',
        'React Developer Certification',
      ],
    },
    'cybersecurity': {
      name: 'Cybersecurity',
      icon: <Security />,
      color: '#F7DC6F',
      growth: '+41%',
      jobs: '6,700+',
      avgSalary: '$105k - $170k',
      description: 'Cybersecurity professionals protect systems, networks, and data from digital attacks. Learn ethical hacking, network security, and threat analysis.',
      skills: [
        { name: 'Ethical Hacking', level: 'Essential', proficiency: 90 },
        { name: 'Network Security', level: 'Essential', proficiency: 92 },
        { name: 'CISSP', level: 'Advanced', proficiency: 85 },
        { name: 'Penetration Testing', level: 'Core', proficiency: 88 },
        { name: 'Security Auditing', level: 'Core', proficiency: 86 },
        { name: 'Cryptography', level: 'Advanced', proficiency: 82 },
        { name: 'Incident Response', level: 'Core', proficiency: 87 },
        { name: 'Linux Security', level: 'Essential', proficiency: 89 },
      ],
      learningPath: [
        'Learn networking fundamentals',
        'Understand security principles',
        'Master ethical hacking techniques',
        'Practice penetration testing',
        'Study cryptography and encryption',
        'Learn incident response procedures',
        'Obtain security certifications',
      ],
      careerRoles: [
        { title: 'Security Engineer', salary: '$110k - $180k', demand: 'Very High' },
        { title: 'Penetration Tester', salary: '$100k - $160k', demand: 'High' },
        { title: 'Security Analyst', salary: '$90k - $140k', demand: 'Very High' },
        { title: 'CISO', salary: '$180k - $300k', demand: 'High' },
      ],
      topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Cisco', 'IBM', 'Microsoft', 'Google'],
      certifications: [
        'CISSP (Certified Information Systems Security Professional)',
        'CEH (Certified Ethical Hacker)',
        'CompTIA Security+',
        'OSCP (Offensive Security Certified Professional)',
      ],
    },
    'data-science': {
      name: 'Data Science & Analytics',
      icon: <DataObject />,
      color: '#BB8FCE',
      growth: '+35%',
      jobs: '9,100+',
      avgSalary: '$100k - $160k',
      description: 'Data Science combines statistics, programming, and domain expertise to extract insights from data. Learn SQL, Python, and visualization tools.',
      skills: [
        { name: 'SQL', level: 'Essential', proficiency: 94 },
        { name: 'Python', level: 'Essential', proficiency: 92 },
        { name: 'R', level: 'Core', proficiency: 85 },
        { name: 'Tableau', level: 'Core', proficiency: 88 },
        { name: 'Power BI', level: 'Core', proficiency: 86 },
        { name: 'Statistics', level: 'Essential', proficiency: 90 },
        { name: 'Data Visualization', level: 'Core', proficiency: 87 },
        { name: 'Excel', level: 'Intermediate', proficiency: 83 },
      ],
      learningPath: [
        'Master SQL for data querying',
        'Learn Python for data analysis',
        'Understand statistics and probability',
        'Practice data visualization',
        'Work with Tableau and Power BI',
        'Learn machine learning basics',
        'Build data-driven projects',
      ],
      careerRoles: [
        { title: 'Data Scientist', salary: '$110k - $170k', demand: 'Very High' },
        { title: 'Data Analyst', salary: '$80k - $130k', demand: 'Very High' },
        { title: 'Business Intelligence Analyst', salary: '$90k - $140k', demand: 'High' },
        { title: 'Data Engineer', salary: '$120k - $180k', demand: 'Very High' },
      ],
      topCompanies: ['Google', 'Meta', 'Amazon', 'Netflix', 'Airbnb', 'Uber'],
      certifications: [
        'Google Data Analytics Certificate',
        'Microsoft Certified: Data Analyst Associate',
        'Tableau Desktop Specialist',
        'IBM Data Science Professional Certificate',
      ],
    },
    'mobile-dev': {
      name: 'Mobile Development',
      icon: <Rocket />,
      color: '#85C1E9',
      growth: '+29%',
      jobs: '7,400+',
      avgSalary: '$95k - $155k',
      description: 'Mobile Development focuses on creating applications for iOS and Android platforms. Learn React Native, Flutter, or native development.',
      skills: [
        { name: 'React Native', level: 'Essential', proficiency: 91 },
        { name: 'Flutter', level: 'Essential', proficiency: 89 },
        { name: 'Swift', level: 'Core', proficiency: 87 },
        { name: 'Kotlin', level: 'Core', proficiency: 86 },
        { name: 'Mobile UI/UX', level: 'Essential', proficiency: 90 },
        { name: 'Firebase', level: 'Core', proficiency: 85 },
        { name: 'REST APIs', level: 'Essential', proficiency: 88 },
        { name: 'App Store Optimization', level: 'Intermediate', proficiency: 80 },
      ],
      learningPath: [
        'Learn mobile development fundamentals',
        'Master React Native or Flutter',
        'Understand mobile UI/UX principles',
        'Work with mobile databases',
        'Implement push notifications',
        'Learn app deployment processes',
        'Build and publish mobile apps',
      ],
      careerRoles: [
        { title: 'Mobile Developer', salary: '$100k - $165k', demand: 'Very High' },
        { title: 'iOS Developer', salary: '$105k - $170k', demand: 'High' },
        { title: 'Android Developer', salary: '$100k - $160k', demand: 'High' },
        { title: 'React Native Developer', salary: '$95k - $155k', demand: 'Very High' },
      ],
      topCompanies: ['Apple', 'Google', 'Meta', 'Uber', 'Spotify', 'Airbnb'],
      certifications: [
        'Google Associate Android Developer',
        'Apple Certified iOS Developer',
        'Meta React Native Certification',
        'Flutter Certified Developer',
      ],
    },
  };

  const domain = domainData[domainName] || domainData['fullstack'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ 
        background: '#6366F1', 
        color: 'white', 
        py: 2 
      }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ 
              color: 'white', 
              mb: 1.5,
              fontSize: '0.875rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Back to Home
          </Button>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: domain.color, width: 48, height: 48 }}>
              {domain.icon}
            </Avatar>
            <Box flex={1}>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  mb: 0.5,
                }}
              >
                {domain.name}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`${domain.growth} Growth`}
                  icon={<TrendingUp />}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }}
                />
                <Chip
                  label={`${domain.jobs} Jobs`}
                  icon={<Work />}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Overview */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Overview
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {domain.description}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Average Salary
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {domain.avgSalary}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Job Openings
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {domain.jobs}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<School />}
                    onClick={() => navigate('/register')}
                  >
                    Start Learning
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Timeline />}
                    onClick={() => navigate('/login')}
                  >
                    View Learning Path
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Essential Skills */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Essential Skills
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Master these skills to excel in {domain.name}
            </Typography>
            <Grid container spacing={2}>
              {domain.skills.map((skill, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {skill.name}
                      </Typography>
                      <Chip
                        label={skill.level}
                        size="small"
                        color={
                          skill.level === 'Essential' ? 'error' :
                          skill.level === 'Core' ? 'warning' : 'info'
                        }
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress
                        variant="determinate"
                        value={skill.proficiency}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Learning Path */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Timeline color="primary" />
                  <Typography variant="h5" fontWeight="bold">
                    Learning Path
                  </Typography>
                </Box>
                <List>
                  {domain.learningPath.map((step, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <Typography variant="body2">{index + 1}</Typography>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <EmojiEvents color="warning" />
                  <Typography variant="h5" fontWeight="bold">
                    Certifications
                  </Typography>
                </Box>
                <List>
                  {domain.certifications.map((cert, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={cert} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Career Roles */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Career Opportunities
            </Typography>
            <Grid container spacing={2} mt={2}>
              {domain.careerRoles.map((role, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {role.title}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Salary Range
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                          {role.salary}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Demand
                        </Typography>
                        <Chip
                          label={role.demand}
                          size="small"
                          color={role.demand === 'Very High' ? 'error' : 'warning'}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Top Hiring Companies
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} mt={3}>
              {domain.topCompanies.map((company, index) => (
                <Chip
                  key={index}
                  label={company}
                  icon={<Star />}
                  sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* CTA */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            mt: 4,
            textAlign: 'center',
            background: '#667eea',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Join SkillOrbit and track your progress in {domain.name}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': { bgcolor: 'grey.100' },
            }}
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default DomainDetails;

