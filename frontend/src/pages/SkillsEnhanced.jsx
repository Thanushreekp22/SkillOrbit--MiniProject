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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Slider,
  InputAdornment,
  Alert,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  TrendingUp,
  Psychology,
  Code,
  Storage,
  Cloud,
  Security,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { SKILLS_LIST, detectCategory } from '../data/skillsList';

const SkillsEnhanced = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    category: '',
    proficiency: 50,
  });

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Cloud',
    'Mobile',
    'AI/ML',
    'Security',
    'Testing',
    'Other',
  ];

  const categoryIcons = {
    Frontend: <Code />,
    Backend: <Storage />,
    Database: <Storage />,
    DevOps: <TrendingUp />,
    Cloud: <Cloud />,
    Mobile: <Psychology />,
    'AI/ML': <Psychology />,
    Security: <Security />,
    Testing: <Code />,
    Other: <Code />,
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchTerm, filterCategory]);

  const fetchSkills = async () => {
    try {
      console.log('Fetching skills for user:', user._id);
      const response = await api.get(`/skills/user/${user._id}`);
      console.log('Skills response:', response.data);
      
      // Handle different response formats
      const skillsData = response.data.skills || response.data || [];
      console.log('Skills data:', skillsData);
      
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to fetch skills');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSkills = () => {
    let filtered = skills;

    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === filterCategory);
    }

    setFilteredSkills(filtered);
  };

  const handleOpenDialog = (skill = null) => {
    if (skill) {
      setCurrentSkill(skill);
      setEditMode(true);
    } else {
      setCurrentSkill({ name: '', category: '', proficiency: 50 });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSkill({ name: '', category: '', proficiency: 50 });
    setEditMode(false);
  };

  const handleSaveSkill = async () => {
    if (!currentSkill.name || !currentSkill.category) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editMode) {
        await api.put(`/skills/${currentSkill._id}`, currentSkill);
        toast.success('Skill updated successfully');
      } else {
        await api.post('/skills', {
          ...currentSkill,
          userId: user._id,
        });
        toast.success('Skill added successfully');
      }
      fetchSkills();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${skillId}`);
        toast.success('Skill deleted successfully');
        fetchSkills();
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return 'success';
    if (proficiency >= 50) return 'warning';
    return 'error';
  };

  const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 80) return 'Expert';
    if (proficiency >= 60) return 'Advanced';
    if (proficiency >= 40) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography>Loading skills...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
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
              <Code sx={{ fontSize: 28 }} />
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
              Skills Management
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
            Track and manage your technical skills
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size="large"
          sx={{ mt: 1 }}
        >
          Add Skill
        </Button>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {skills.length}
            </Typography>
            <Typography color="text.secondary">Total Skills</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {skills.filter(s => s.proficiency >= 80).length}
            </Typography>
            <Typography color="text.secondary">Expert Level</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length) : 0}%
            </Typography>
            <Typography color="text.secondary">Avg Proficiency</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Filter by Category"
                startAdornment={<FilterList sx={{ ml: 1, mr: -0.5 }} />}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || filterCategory !== 'all'
              ? 'No skills match your filters'
              : 'No skills added yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start building your skill portfolio by adding your first skill'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Your First Skill
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredSkills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill._id}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {categoryIcons[skill.category] || <Code />}
                      <Typography variant="h6" fontWeight="bold">
                        {skill.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(skill)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSkill(skill._id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Chip
                    label={skill.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        Proficiency
                      </Typography>
                      <Chip
                        label={getProficiencyLabel(skill.proficiency)}
                        size="small"
                        color={getProficiencyColor(skill.proficiency)}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress
                        variant="determinate"
                        value={skill.proficiency}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                        color={getProficiencyColor(skill.proficiency)}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                  </Box>

                  {skill.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      Added {new Date(skill.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Skill' : 'Add New Skill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={SKILLS_LIST}
              value={currentSkill.name}
              onChange={(event, newValue) => {
                const skillName = newValue || '';
                const detectedCategory = detectCategory(skillName);
                setCurrentSkill({ 
                  ...currentSkill, 
                  name: skillName,
                  category: detectedCategory || currentSkill.category
                });
              }}
              onInputChange={(event, newInputValue) => {
                const detectedCategory = detectCategory(newInputValue);
                setCurrentSkill({ 
                  ...currentSkill, 
                  name: newInputValue,
                  category: detectedCategory || currentSkill.category
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skill Name"
                  placeholder="Start typing to see suggestions..."
                  helperText="Category will be auto-detected based on skill name"
                />
              )}
              sx={{ mb: 3 }}
              filterOptions={(options, { inputValue }) => {
                // Filter options that match the input
                const filtered = options.filter((option) =>
                  option.toLowerCase().includes(inputValue.toLowerCase())
                );
                // Limit to top 10 suggestions for better UX
                return filtered.slice(0, 10);
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={currentSkill.category}
                onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>
                Proficiency Level: {currentSkill.proficiency}% - {getProficiencyLabel(currentSkill.proficiency)}
              </Typography>
              <Slider
                value={currentSkill.proficiency}
                onChange={(e, value) => setCurrentSkill({ ...currentSkill, proficiency: value })}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Proficiency Guide:</strong><br />
                0-39%: Beginner | 40-59%: Intermediate | 60-79%: Advanced | 80-100%: Expert
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSkill} variant="contained">
            {editMode ? 'Update' : 'Add'} Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SkillsEnhanced;
