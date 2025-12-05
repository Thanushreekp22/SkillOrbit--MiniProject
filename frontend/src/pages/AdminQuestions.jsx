import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem as MenuItemMui,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowBack,
  Search,
  AdminPanelSettings,
  ExitToApp,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api/axios';

const AdminQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const [formData, setFormData] = useState({
    skillName: '',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'basic',
    questionType: 'mcq',
    explanation: '',
  });

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    
    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(admin));
    fetchQuestions();
  }, [page, rowsPerPage, filterSkill, filterDifficulty]);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });

  const fetchQuestions = async () => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      
      if (filterSkill) params.skillName = filterSkill;
      if (filterDifficulty) params.difficulty = filterDifficulty;

      const response = await api.get('/admin/dashboard/questions', {
        ...getAuthConfig(),
        params,
      });

      setQuestions(response.data.questions || []);
      setTotalQuestions(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      skillName: '',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'basic',
      questionType: 'mcq',
      explanation: '',
    });
    setOpenDialog(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      skillName: question.skillName,
      questionText: question.questionText,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      questionType: question.questionType,
      explanation: question.explanation || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.delete(`/admin/dashboard/questions/${id}`, getAuthConfig());
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingQuestion) {
        await api.put(
          `/admin/dashboard/questions/${editingQuestion._id}`,
          formData,
          getAuthConfig()
        );
        toast.success('Question updated successfully');
      } else {
        await api.post('/admin/dashboard/questions', formData, getAuthConfig());
        toast.success('Question created successfully');
      }
      
      setOpenDialog(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Admin Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: '#667eea' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/admin/dashboard')}>
            <ArrowBack />
          </IconButton>
          <AdminPanelSettings sx={{ mr: 2, ml: 2, fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Question Management
          </Typography>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              {adminData?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItemMui onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} fontSize="small" />
              Logout
            </MenuItemMui>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header & Actions */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700}>
            Questions Bank
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddQuestion}
            sx={{
              bgcolor: '#667eea',
              '&:hover': {
                bgcolor: '#5568d3',
              },
            }}
          >
            Add Question
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <TextField
              select
              label="Skill"
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Skills</MenuItem>
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="React">React</MenuItem>
              <MenuItem value="Node.js">Node.js</MenuItem>
            </TextField>
            <TextField
              select
              label="Difficulty"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Box>
        </Paper>

        {/* Questions Table */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Question</strong></TableCell>
                    <TableCell><strong>Skill</strong></TableCell>
                    <TableCell><strong>Difficulty</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell align="right"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell sx={{ maxWidth: 400 }}>
                        {question.questionText.substring(0, 100)}...
                      </TableCell>
                      <TableCell>
                        <Chip label={question.skillName} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={question.difficulty}
                          size="small"
                          color={
                            question.difficulty === 'basic'
                              ? 'success'
                              : question.difficulty === 'intermediate'
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>{question.questionType}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteQuestion(question._id)}
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
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </Paper>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Skill Name"
              value={formData.skillName}
              onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
              required
            />
            <TextField
              label="Question Text"
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              multiline
              rows={3}
              required
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Options</Typography>
              {formData.options.map((option, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
            <TextField
              label="Correct Answer"
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              required
            />
            <FormControl>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Explanation (optional)"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingQuestion ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminQuestions;
