import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem as MenuItemMUI
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  Dashboard as DashboardIcon,
  QuestionAnswer,
  Menu as MenuIcon,
  ExitToApp,
  AccountCircle
} from '@mui/icons-material';
import {
  getAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion
} from '../../api/adminApi';

const QuestionManagement = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  
  // Sidebar states
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const [formData, setFormData] = useState({
    skillName: '',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'basic',
    questionType: 'mcq',
    explanation: '',
    tags: []
  });

  // Reference: Job Roles and their associated skills
  // Use these as guidance when adding questions
  const roleSkillsReference = {
    'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'JavaScript'],
    'Data Scientist': ['Python', 'SQL', 'R', 'Machine Learning', 'Statistics'],
    'Cloud Engineer': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX'],
    'AI/ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
    'Cybersecurity Specialist': ['Network Security', 'Ethical Hacking', 'CISSP', 'Penetration Testing', 'Cryptography'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Ansible'],
    'Data Analyst': ['SQL', 'Tableau', 'Power BI', 'Excel', 'Data Visualization']
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, rowsPerPage, filterSkill, filterDifficulty]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        skillName: filterSkill,
        difficulty: filterDifficulty
      };

      const response = await getAllQuestions(params);
      setQuestions(response.data.questions);
      setTotalQuestions(response.data.total);
      setError('');
    } catch (err) {
      setError('Failed to fetch questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchQuestions();
  };

  const handleOpenDialog = (mode, question = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && question) {
      setSelectedQuestion(question);
      setFormData({
        skillName: question.skillName,
        questionText: question.questionText,
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
        questionType: question.questionType || 'mcq',
        explanation: question.explanation || '',
        tags: question.tags || []
      });
    } else {
      setFormData({
        skillName: '',
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 'basic',
        questionType: 'mcq',
        explanation: '',
        tags: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuestion(null);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'add') {
        await addQuestion(formData);
        setSuccess('Question added successfully');
      } else {
        await updateQuestion(selectedQuestion._id, formData);
        setSuccess('Question updated successfully');
      }
      handleCloseDialog();
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await deleteQuestion(id);
      setSuccess('Question deleted successfully');
      fetchQuestions();
    } catch (err) {
      setError('Failed to delete question');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      basic: 'success',
      intermediate: 'warning',
      advanced: 'error'
    };
    return colors[difficulty] || 'default';
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, route: '/admin/dashboard' },
    { text: 'Questions', icon: <QuestionAnswer />, route: '/admin/questions' }
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={item.route === '/admin/questions'}
            onClick={() => {
              navigate(item.route);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon sx={{ color: item.route === '/admin/questions' ? '#667eea' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: '#667eea'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            SkillOrbit Admin - Questions
          </Typography>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItemMUI disabled>
              <Typography variant="body2">{adminData.email}</Typography>
            </MenuItemMUI>
            <Divider />
            <MenuItemMUI onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItemMUI>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8
        }}
      >
        <Container maxWidth="xl">
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                Question Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog('add')}
                sx={{ background: '#667eea' }}
              >
                Add Question
              </Button>
            </Box>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Role-Skills Reference */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            💡 Job Roles & Skills Reference
          </Typography>
          <Grid container spacing={1}>
            {Object.entries(roleSkillsReference).map(([role, skills]) => (
              <Grid item xs={12} sm={6} md={3} key={role}>
                <Typography variant="caption" fontWeight="bold" display="block">
                  {role}:
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {skills.join(', ')}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Alert>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Skill</InputLabel>
              <Select
                value={filterSkill}
                label="Skill"
                onChange={(e) => setFilterSkill(e.target.value)}
              >
                <MenuItem value="">All Skills</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="MongoDB">MongoDB</MenuItem>
                <MenuItem value="TypeScript">TypeScript</MenuItem>
                <MenuItem value="SQL">SQL</MenuItem>
                <MenuItem value="R">R</MenuItem>
                <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                <MenuItem value="TensorFlow">TensorFlow</MenuItem>
                <MenuItem value="PyTorch">PyTorch</MenuItem>
                <MenuItem value="Deep Learning">Deep Learning</MenuItem>
                <MenuItem value="NLP">NLP</MenuItem>
                <MenuItem value="AWS">AWS</MenuItem>
                <MenuItem value="Docker">Docker</MenuItem>
                <MenuItem value="Kubernetes">Kubernetes</MenuItem>
                <MenuItem value="Terraform">Terraform</MenuItem>
                <MenuItem value="Linux">Linux</MenuItem>
                <MenuItem value="Network Security">Network Security</MenuItem>
                <MenuItem value="Ethical Hacking">Ethical Hacking</MenuItem>
                <MenuItem value="CI/CD">CI/CD</MenuItem>
                <MenuItem value="Jenkins">Jenkins</MenuItem>
                <MenuItem value="Ansible">Ansible</MenuItem>
                <MenuItem value="Tableau">Tableau</MenuItem>
                <MenuItem value="Power BI">Power BI</MenuItem>
                <MenuItem value="React Native">React Native</MenuItem>
                <MenuItem value="Flutter">Flutter</MenuItem>
                <MenuItem value="Swift">Swift</MenuItem>
                <MenuItem value="Kotlin">Kotlin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filterDifficulty}
                label="Difficulty"
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Skill</strong></TableCell>
                    <TableCell><strong>Question</strong></TableCell>
                    <TableCell><strong>Difficulty</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question._id} hover>
                      <TableCell>{question.skillName}</TableCell>
                      <TableCell sx={{ maxWidth: 400 }}>
                        {question.questionText.substring(0, 100)}...
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.difficulty}
                          color={getDifficultyColor(question.difficulty)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{question.questionType}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog('edit', question)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(question._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalQuestions}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Question' : 'Edit Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Skill Name</InputLabel>
              <Select
                value={formData.skillName}
                label="Skill Name"
                onChange={(e) => handleFormChange('skillName', e.target.value)}
              >
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="MongoDB">MongoDB</MenuItem>
                <MenuItem value="TypeScript">TypeScript</MenuItem>
                <MenuItem value="SQL">SQL</MenuItem>
                <MenuItem value="R">R</MenuItem>
                <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                <MenuItem value="Statistics">Statistics</MenuItem>
                <MenuItem value="TensorFlow">TensorFlow</MenuItem>
                <MenuItem value="PyTorch">PyTorch</MenuItem>
                <MenuItem value="Deep Learning">Deep Learning</MenuItem>
                <MenuItem value="NLP">NLP</MenuItem>
                <MenuItem value="AWS">AWS</MenuItem>
                <MenuItem value="Docker">Docker</MenuItem>
                <MenuItem value="Kubernetes">Kubernetes</MenuItem>
                <MenuItem value="Terraform">Terraform</MenuItem>
                <MenuItem value="Linux">Linux</MenuItem>
                <MenuItem value="Network Security">Network Security</MenuItem>
                <MenuItem value="Ethical Hacking">Ethical Hacking</MenuItem>
                <MenuItem value="CISSP">CISSP</MenuItem>
                <MenuItem value="Penetration Testing">Penetration Testing</MenuItem>
                <MenuItem value="Cryptography">Cryptography</MenuItem>
                <MenuItem value="CI/CD">CI/CD</MenuItem>
                <MenuItem value="Jenkins">Jenkins</MenuItem>
                <MenuItem value="Ansible">Ansible</MenuItem>
                <MenuItem value="Tableau">Tableau</MenuItem>
                <MenuItem value="Power BI">Power BI</MenuItem>
                <MenuItem value="Excel">Excel</MenuItem>
                <MenuItem value="Data Visualization">Data Visualization</MenuItem>
                <MenuItem value="React Native">React Native</MenuItem>
                <MenuItem value="Flutter">Flutter</MenuItem>
                <MenuItem value="Swift">Swift</MenuItem>
                <MenuItem value="Kotlin">Kotlin</MenuItem>
                <MenuItem value="Mobile UI/UX">Mobile UI/UX</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Question Text"
              value={formData.questionText}
              onChange={(e) => handleFormChange('questionText', e.target.value)}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={(e) => handleFormChange('difficulty', e.target.value)}
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={formData.questionType}
                    label="Question Type"
                    onChange={(e) => handleFormChange('questionType', e.target.value)}
                  >
                    <MenuItem value="mcq">Multiple Choice</MenuItem>
                    <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                    <MenuItem value="true-false">True/False</MenuItem>
                    <MenuItem value="short-answer">Short Answer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {(formData.questionType === 'mcq' || formData.questionType === 'multiple-choice') && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Options:
                </Typography>
                {formData.options.map((option, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    margin="normal"
                  />
                ))}
              </>
            )}

            <TextField
              fullWidth
              label="Correct Answer"
              value={formData.correctAnswer}
              onChange={(e) => handleFormChange('correctAnswer', e.target.value)}
              margin="normal"
              required
              helperText="Enter the exact correct answer"
            />

            <TextField
              fullWidth
              label="Explanation (Optional)"
              value={formData.explanation}
              onChange={(e) => handleFormChange('explanation', e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />

            {/* Helper: Show which roles use the selected skill */}
            {formData.skillName && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  This skill is used in:
                </Typography>
                {Object.entries(roleSkillsReference)
                  .filter(([role, skills]) => skills.includes(formData.skillName))
                  .map(([role]) => (
                    <Chip key={role} label={role} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default QuestionManagement;
