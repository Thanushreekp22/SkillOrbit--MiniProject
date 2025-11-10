import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Quiz,
  Timer,
  CheckCircle,
  Cancel,
  TrendingUp,
  School,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState('select'); // select, taking, results
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('basic');
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available skills grouped by job role
  const skillsByRole = {
    'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'JavaScript'],
    'Data Scientist': ['Python', 'SQL', 'R', 'Machine Learning', 'Statistics'],
    'Cloud Engineer': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX'],
    'AI/ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
    'Cybersecurity Specialist': ['Network Security', 'Ethical Hacking', 'CISSP', 'Penetration Testing', 'Cryptography'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Ansible'],
    'Data Analyst': ['SQL', 'Tableau', 'Power BI', 'Excel', 'Data Visualization']
  };
  
  const allSkills = [...new Set(Object.values(skillsByRole).flat())].sort();
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (currentStep === 'taking' && startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, startTime]);

  // Fetch assessment history
  useEffect(() => {
    if (currentStep === 'select') {
      fetchAssessmentHistory();
    }
  }, [currentStep]);

  const fetchAssessmentHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get('/assessment/history?limit=5');
      setAssessmentHistory(response.data.assessments || []);
    } catch (error) {
      console.error('Error fetching assessment history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Start assessment
  const startAssessment = async () => {
    if (!selectedSkill) {
      toast.error('Please select a skill to assess');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/assessment/start', {
        skillName: selectedSkill,
        difficulty: selectedDifficulty
      });

      console.log('Assessment started:', response.data);
      
      if (!response.data.questions || response.data.questions.length === 0) {
        toast.error(`No questions available for ${selectedSkill} at ${selectedDifficulty} level. Please try a different skill or difficulty.`);
        return;
      }
      
      setAssessment(response.data);
      setQuestions(response.data.questions);
      setCurrentStep('taking');
      setStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setAnswers({});
      toast.success('Assessment started! Good luck!');
    } catch (error) {
      console.error('Error starting assessment:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to start assessment';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Go to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Go to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit assessment
  const submitAssessment = async () => {
    if (isSubmitting) {
      toast.warning('Assessment is already being submitted...');
      return;
    }
    
    setLoading(true);
    setIsSubmitting(true);
    
    const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
      questionId,
      userAnswer,
      timeSpent: Math.floor(timeSpent / questions.length) // Average time per question
    }));

    const assessmentId = assessment.assessmentId || assessment._id;
    
    if (!assessmentId) {
      toast.error('Assessment ID not found. Please start a new assessment.');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }
    
    console.log('Submitting assessment:', {
      assessmentId,
      answersCount: formattedAnswers.length,
      timeSpent
    });

    try {
      const response = await api.post(`/assessment/${assessmentId}/submit`, {
        answers: formattedAnswers,
        timeSpent
      });

      console.log('✅ Assessment submitted successfully:', response.data);

      // Submission successful - update UI
      if (response.data && response.data.assessment) {
        setResults(response.data.assessment);
        setCurrentStep('results');
        setShowResults(true);
        
        // Only show success toast, no error
        toast.success('🎉 Assessment completed successfully!', {
          autoClose: 3000,
          position: 'top-center'
        });
      } else {
        console.error('Invalid response structure:', response.data);
        toast.error('Received invalid response from server');
      }
    } catch (error) {
      console.error('❌ Assessment submission error:', error);
      console.error('Error response:', error.response?.data);
      
      // Check if assessment was actually saved despite error
      if (error.response?.data?.assessment) {
        // Assessment was saved, show results despite error
        console.log('Assessment saved despite error, showing results');
        setResults(error.response.data.assessment);
        setCurrentStep('results');
        setShowResults(true);
        toast.success('🎉 Assessment completed successfully!', {
          autoClose: 3000,
          position: 'top-center'
        });
      } else if (error.response?.status === 400 && error.response?.data?.alreadyCompleted) {
        // Assessment already completed
        toast.warning('This assessment was already submitted');
        setTimeout(() => {
          setCurrentStep('select');
          setAssessment(null);
          setQuestions([]);
          setAnswers({});
          setSelectedSkill('');
          toast.info('Please start a new assessment');
        }, 2000);
      } else if (error.response?.status >= 500) {
        // Server error - check if we can still show results
        console.log('Server error but checking if assessment was saved');
        // Don't show error toast, let user check dashboard
        toast.warning('There was an issue, please check your dashboard to verify your results.');
      } else if (error.message === 'Network Error') {
        // Network error
        toast.error('Network error. Please check your connection.');
      } else {
        // Other errors
        const errorMessage = error.response?.data?.message || 'Failed to submit assessment';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 60) return 'warning';
    return 'error';
  };

  // Skill Selection Step
  if (currentStep === 'select') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <AssessmentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Skill Assessment
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Test your knowledge and get objective skill evaluation
          </Typography>
        </Box>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Select Assessment Parameters
            </Typography>
            
            <Box mb={4}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Choose a Skill to Assess</FormLabel>
                <Select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  displayEmpty
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select a skill...
                  </MenuItem>
                  {Object.entries(skillsByRole).map(([role, skills]) => [
                    <MenuItem key={role} disabled sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {role}
                    </MenuItem>,
                    ...skills.map(skill => (
                      <MenuItem key={skill} value={skill} sx={{ pl: 4 }}>
                        {skill}
                      </MenuItem>
                    ))
                  ])}
                </Select>
              </FormControl>
            </Box>

            <Box mb={4}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Difficulty Level</FormLabel>
                <RadioGroup
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  row
                >
                  <FormControlLabel value="basic" control={<Radio />} label="Basic" />
                  <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
                  <FormControlLabel value="advanced" control={<Radio />} label="Advanced" />
                </RadioGroup>
              </FormControl>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                • Assessment contains 10 questions<br/>
                • No time limit, but time will be tracked<br/>
                • You can navigate between questions<br/>
                • Results will show detailed feedback
              </Typography>
            </Alert>

            <Box textAlign="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<Quiz />}
                onClick={startAssessment}
                disabled={!selectedSkill || loading}
                sx={{ px: 4, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Start Assessment'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Assessment History */}
        {assessmentHistory.length > 0 && (
          <Card elevation={3} sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Assessments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loadingHistory ? (
                <Box display="flex" justifyContent="center" py={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {assessmentHistory.map((assessment) => (
                    <Grid item xs={12} key={assessment._id}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="h6">{assessment.skillName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(assessment.createdAt).toLocaleDateString()} • {assessment.difficulty}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Chip
                              label={`${assessment.score}%`}
                              color={assessment.score >= 75 ? 'success' : assessment.score >= 60 ? 'warning' : 'error'}
                              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                            />
                            <Typography variant="caption" display="block" mt={0.5}>
                              {assessment.correctAnswers}/{assessment.totalQuestions} correct
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    );
  }

  // Taking Assessment Step
  if (currentStep === 'taking' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
              {selectedSkill} Assessment - {selectedDifficulty}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip icon={<Timer />} label={formatTime(timeSpent)} color="primary" />
              <Chip 
                label={`${answeredCount}/${questions.length} answered`} 
                color={answeredCount === questions.length ? 'success' : 'default'} 
              />
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" color="text.secondary" mt={1}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
        </Paper>

        {/* Question */}
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.questionText}
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
              <RadioGroup
                value={answers[currentQuestion._id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
              >
                {currentQuestion.options && Array.isArray(currentQuestion.options) ? (
                  currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{ 
                        mb: 1.5, 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: answers[currentQuestion._id] === option ? 'primary.main' : 'divider',
                        bgcolor: answers[currentQuestion._id] === option ? 'primary.light' : 'background.paper',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          borderColor: 'primary.main'
                        }
                      }}
                    />
                  ))
                ) : (
                  <Typography color="error">No options available for this question</Typography>
                )}
              </RadioGroup>
            </FormControl>

            {/* Navigation */}
            <Box mt={4}>
              {currentQuestionIndex === questions.length - 1 && answeredCount < questions.length && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You have {questions.length - answeredCount} unanswered question(s). You can still submit, but unanswered questions will be marked as incorrect.
                </Alert>
              )}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <Typography variant="body2" color="text.secondary">
                  {currentQuestionIndex + 1} / {questions.length}
                </Typography>

                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={submitAssessment}
                    disabled={Object.keys(answers).length === 0 || loading || isSubmitting}
                    startIcon={loading || isSubmitting ? <CircularProgress size={20} /> : <CheckCircle />}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={nextQuestion}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Results Step
  if (currentStep === 'results' && results) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Assessment Complete!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here are your results for {results.skillName}
          </Typography>
        </Box>

        {/* Score Card */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h2" color={`${getScoreColor(results.score)}.main`} gutterBottom>
              {results.score}%
            </Typography>
            <Typography variant="h5" gutterBottom>
              {results.correctAnswers} out of {results.totalQuestions} correct
            </Typography>
            <Chip 
              label={results.difficulty} 
              color="primary" 
              sx={{ textTransform: 'capitalize', mb: 2 }} 
            />
            <Typography variant="body1" color="text.secondary">
              Time taken: {formatTime(results.timeSpent)}
            </Typography>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feedback
            </Typography>
            <Alert severity={getScoreColor(results.score)}>
              {results.feedback}
            </Alert>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => {
              setCurrentStep('select');
              setResults(null);
              setSelectedSkill('');
              setSelectedDifficulty('basic');
            }}
            startIcon={<Quiz />}
          >
            Take Another Assessment
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Force page reload to refresh dashboard data
              window.location.href = '/app/dashboard';
            }}
            startIcon={<TrendingUp />}
          >
            View Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={64} />
      </Box>
    </Container>
  );
};

export default Assessment;
