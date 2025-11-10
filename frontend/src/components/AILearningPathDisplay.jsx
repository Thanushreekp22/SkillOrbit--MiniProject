import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Save,
  Favorite,
  FavoriteBorder,
  Share,
  Download,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  School,
  PlayCircleOutline,
  MenuBook,
  Code,
  Link as LinkIcon,
  Timeline,
  EmojiObjects,
  TrendingUp,
  OpenInNew,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AILearningPathDisplay = ({ learningPath, onSave, isSaved = false }) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef(null);

  const handleSave = () => {
    if (!title.trim()) {
      toast.warning('Please enter a title for your learning path');
      return;
    }
    onSave({ ...learningPath, title, isFavorite });
    setSaveDialogOpen(false);
    setTitle('');
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Create a simple text-based PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add text with word wrap
      const addText = (text, fontSize = 10, isBold = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        lines.forEach(line => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 3;
      };

      // Title
      addText('🎯 Your Personalized Learning Path', 18, true);
      addText(`Generated on: ${new Date(learningPath.generatedAt).toLocaleString()}`, 10);
      yPosition += 5;

      // Add sections
      const sections = parseSections();
      Object.entries(sections).forEach(([key, value]) => {
        addText(key.replace(/_/g, ' ').toUpperCase(), 14, true);
        addText(value, 10);
        yPosition += 3;
      });

      // Add full response if sections not available
      if (Object.keys(sections).length === 0) {
        addText('COMPLETE AI RECOMMENDATIONS', 14, true);
        addText(learningPath.rawResponse, 10);
      }

      // Add resources
      if (learningPath.resources && learningPath.resources.length > 0) {
        pdf.addPage();
        yPosition = margin;
        addText('📚 RECOMMENDED RESOURCES', 14, true);
        learningPath.resources.forEach((resource, index) => {
          addText(`${index + 1}. ${resource.title} (${resource.type})`, 10, true);
          addText(`   ${resource.url}`, 9);
        });
      }

      // Save the PDF
      const fileName = `learning-path-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'course':
        return <School color="primary" />;
      case 'video':
        return <PlayCircleOutline color="error" />;
      case 'documentation':
        return <MenuBook color="info" />;
      case 'tutorial':
        return <Code color="success" />;
      default:
        return <LinkIcon color="action" />;
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case 'course':
        return 'primary';
      case 'video':
        return 'error';
      case 'documentation':
        return 'info';
      case 'tutorial':
        return 'success';
      default:
        return 'default';
    }
  };

  // Parse sections from raw response
  const parseSections = () => {
    if (learningPath.sections && Object.keys(learningPath.sections).length > 0) {
      return learningPath.sections;
    }

    // Fallback: try to parse from raw response
    const sections = {};
    const sectionPatterns = [
      'Gap Analysis',
      'Learning Path',
      'Recommended Resources',
      'Timeline',
      'Projects',
      'Milestones',
      'Priority Order'
    ];

    sectionPatterns.forEach(pattern => {
      const regex = new RegExp(`\\*\\*${pattern}\\*\\*:?([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`, 'i');
      const match = learningPath.rawResponse?.match(regex);
      if (match) {
        sections[pattern.toLowerCase().replace(/\s+/g, '_')] = match[1].trim();
      }
    });

    return sections;
  };

  const sections = parseSections();

  return (
    <Box>
      {/* Header Actions */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              🎯 Your Personalized Learning Path
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Generated on {new Date(learningPath.generatedAt).toLocaleString()}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {!isSaved && (
              <Tooltip title="Save Learning Path">
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => setSaveDialogOpen(true)}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Save Path
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Share">
              <IconButton sx={{ color: 'white' }}>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download PDF">
              <IconButton 
                sx={{ color: 'white' }}
                onClick={handleDownloadPDF}
                disabled={downloading}
              >
                {downloading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Download />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Resources Section */}
      {learningPath.resources && learningPath.resources.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkIcon color="primary" />
            Recommended Resources ({learningPath.resources.length})
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {learningPath.resources.map((resource, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {getResourceIcon(resource.type)}
                      <Chip
                        label={resource.type}
                        size="small"
                        color={getResourceColor(resource.type)}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-word' }}>
                      {resource.title}
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      endIcon={<OpenInNew />}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Resource
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Structured Sections */}
      {Object.keys(sections).length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline color="primary" />
            Learning Path Breakdown
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {Object.entries(sections).map(([key, value]) => (
            <Accordion key={key} defaultExpanded={key === 'gap_analysis'}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ 
                  '& ul': { pl: 2 },
                  '& li': { mb: 1 },
                  '& strong': { color: 'primary.main' }
                }}>
                  <ReactMarkdown>{value}</ReactMarkdown>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}

      {/* Full Response */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiObjects color="primary" />
          Complete AI Recommendations
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            '& strong': { fontWeight: 700, color: 'primary.main' },
            '& h1, & h2, & h3': { color: 'primary.main', mt: 2, mb: 1 },
            '& ul, & ol': { pl: 3 },
            '& li': { mb: 0.5 },
            '& a': { color: 'secondary.main', textDecoration: 'underline' }
          }}
        >
          <ReactMarkdown>{learningPath.rawResponse}</ReactMarkdown>
        </Box>
      </Paper>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Learning Path</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Full Stack Developer Path 2024"
            helperText="Give your learning path a memorable name"
          />
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <IconButton onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2">Mark as favorite</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AILearningPathDisplay;
