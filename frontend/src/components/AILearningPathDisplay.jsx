import React, { useState } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Save,
  Favorite,
  FavoriteBorder,
  Download,
  School,
  PlayCircleOutline,
  MenuBook,
  Code,
  Link as LinkIcon,
  TrendingUp,
  OpenInNew,
  Language,
  WorkOutline,
  Speed,
  Assessment,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const AILearningPathDisplay = ({ learningPath, onSave, isSaved = false }) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      // Helper function to clean markdown formatting
      const cleanMarkdown = (text) => {
        if (!text) return '';
        return text
          // Remove code blocks (must be first)
          .replace(/```[\s\S]*?```/g, '[Code Block]')
          // Remove inline code
          .replace(/`([^`]+)`/g, '$1')
          // Remove bold markers (both ** and __)
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/__([^_]+)__/g, '$1')
          // Remove italic markers (both * and _)
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/_([^_]+)_/g, '$1')
          // Remove strikethrough
          .replace(/~~(.+?)~~/g, '$1')
          // Remove headers (# ## ### etc)
          .replace(/^#{1,6}\s+/gm, '')
          // Remove links but keep text [text](url)
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
          // Remove reference links [text][ref]
          .replace(/\[([^\]]+)\]\[[^\]]+\]/g, '$1')
          // Remove images ![alt](url)
          .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
          // Remove HTML tags
          .replace(/<[^>]+>/g, '')
          // Remove blockquotes
          .replace(/^>\s+/gm, '')
          // Convert bullet points to simple bullet
          .replace(/^[\*\-\+]\s+/gm, '• ')
          // Keep numbered lists but remove extra spaces
          .replace(/^\d+\.\s+/gm, (match) => match.trim() + ' ')
          // Remove horizontal rules
          .replace(/^[-*_]{3,}$/gm, '')
          // Remove table formatting
          .replace(/\|/g, ' ')
          // Clean up multiple spaces
          .replace(/[ \t]+/g, ' ')
          // Clean up multiple newlines
          .replace(/\n{3,}/g, '\n\n')
          // Trim each line
          .split('\n').map(line => line.trim()).join('\n')
          // Final trim
          .trim();
      };

      // Create a simple text-based PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add text with word wrap
      const addText = (text, fontSize = 10, isBold = false) => {
        // Clean markdown before adding to PDF
        const cleanedText = cleanMarkdown(text);
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const lines = pdf.splitTextToSize(cleanedText, maxWidth);
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
      addText('Your Personalized Learning Path', 18, true);
      addText(`Generated on: ${new Date(learningPath.generatedAt).toLocaleString()}`, 10);
      yPosition += 5;

      // Add sections
      const sections = parseSections();
      Object.entries(sections).forEach(([key, value]) => {
        const sectionTitle = key.replace(/_/g, ' ').toUpperCase();
        addText(sectionTitle, 14, true);
        addText(value, 10);
        yPosition += 5;
      });

      // Add full response if sections not available
      if (Object.keys(sections).length === 0) {
        addText('COMPLETE AI RECOMMENDATIONS', 14, true);
        addText(learningPath.rawResponse, 10);
      }

      // Add resources
      if (learningPath.resources && learningPath.resources.length > 0) {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        } else {
          yPosition += 5;
        }
        addText('RECOMMENDED RESOURCES', 14, true);
        yPosition += 2;
        learningPath.resources.forEach((resource, index) => {
          const resourceTitle = cleanMarkdown(resource.title);
          const resourceType = resource.type || 'Resource';
          addText(`${index + 1}. ${resourceTitle} (${resourceType})`, 10, true);
          if (resource.url) {
            addText(`   URL: ${resource.url}`, 9);
          }
          yPosition += 2;
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

  // Extract key information from AI response
  const extractKeyInfo = () => {
    const text = learningPath.rawResponse || '';
    
    // Extract timeline/duration
    const timelineMatch = text.match(/(\d+[-–]\d+\s*(?:weeks?|months?|days?))/i);
    const timeline = timelineMatch ? timelineMatch[1] : 'Flexible';
    
    // Extract difficulty level
    const levelMatch = text.match(/(beginner|intermediate|advanced)/i);
    const level = levelMatch ? levelMatch[1] : 'Intermediate';
    
    return { timeline, level };
  };

  const { timeline, level } = extractKeyInfo();

  return (
    <Box>
      {/* Header Card */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 3,
          background: '#667eea',
          color: 'white',
          borderRadius: '16px',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box flex={1}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                🎯 Your AI-Powered Learning Path
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95, mb: 2 }}>
                Generated {new Date(learningPath.generatedAt).toLocaleDateString()} at {new Date(learningPath.generatedAt).toLocaleTimeString()}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip 
                  icon={<Speed sx={{ color: 'white !important' }} />}
                  label={timeline}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
                />
                <Chip 
                  icon={<TrendingUp sx={{ color: 'white !important' }} />}
                  label={level}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
                />
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              {!isSaved && (
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => setSaveDialogOpen(true)}
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Save
                </Button>
              )}
              <IconButton 
                size="small"
                onClick={handleDownloadPDF}
                disabled={downloading}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                {downloading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Download fontSize="small" />}
              </IconButton>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Curated Resources */}
      {learningPath.resources && learningPath.resources.length > 0 && (
        <Card elevation={2} sx={{ mb: 3, borderRadius: '12px' }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <LinkIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Curated Resources
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {learningPath.resources.length} handpicked resources
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {learningPath.resources.slice(0, 6).map((resource, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" gap={1.5}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${getResourceColor(resource.type)}.50`,
                            flexShrink: 0
                          }}
                        >
                          {getResourceIcon(resource.type)}
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography 
                            variant="body2" 
                            fontWeight={600} 
                            sx={{ 
                              mb: 0.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {resource.title}
                          </Typography>
                          <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                            <Chip
                              label={resource.type}
                              size="small"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.7rem',
                                bgcolor: 'background.default'
                              }}
                            />
                            <IconButton
                              size="small"
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.50' }
                              }}
                            >
                              <OpenInNew fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {learningPath.resources.length > 6 && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ display: 'block', textAlign: 'center', mt: 2 }}
              >
                +{learningPath.resources.length - 6} more resources in full report
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Sections Grid */}
      {Object.keys(sections).length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(sections).slice(0, 4).map(([key, value]) => {
            const sectionIcons = {
              'gap_analysis': <Assessment />,
              'learning_path': <TrendingUp />,
              'recommended_resources': <School />,
              'timeline': <Speed />,
              'projects': <Code />,
              'priority_order': <WorkOutline />
            };
            
            const sectionColors = {
              'gap_analysis': 'error',
              'learning_path': 'primary',
              'recommended_resources': 'success',
              'timeline': 'warning',
              'projects': 'info',
              'priority_order': 'secondary'
            };

            return (
              <Grid item xs={12} sm={6} key={key}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${sectionColors[key] || 'primary'}.50`,
                          color: `${sectionColors[key] || 'primary'}.main`,
                          width: 36,
                          height: 36
                        }}
                      >
                        {sectionIcons[key] || <Language />}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6
                      }}
                    >
                      {value.replace(/[*#]/g, '').substring(0, 180)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Detailed Roadmap */}
      <Card elevation={2} sx={{ borderRadius: '12px' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Complete Learning Roadmap
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your personalized step-by-step guide
              </Typography>
            </Box>
          </Box>
          
          <Box
            sx={{
              bgcolor: 'background.default',
              borderRadius: '8px',
              p: 2.5,
              maxHeight: '600px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'background.paper',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'divider',
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: 'text.secondary'
                }
              }
            }}
          >
            {learningPath.rawResponse.split('\n').map((line, index) => {
              const trimmedLine = line.trim();
              
              // Skip empty lines
              if (!trimmedLine) {
                return <Box key={index} sx={{ height: '12px' }} />;
              }

              // Main section headers (### or **Section Name:**)
              if (trimmedLine.startsWith('###') || (trimmedLine.startsWith('**') && trimmedLine.includes(':**'))) {
                const headerText = trimmedLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/:/g, '');
                return (
                  <Box key={index} sx={{ mt: 3, mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#667eea',
                        borderBottom: '3px solid #667eea',
                        pb: 0.5,
                        display: 'inline-block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '1.1rem'
                      }}
                    >
                      {headerText}
                    </Typography>
                  </Box>
                );
              }

              // Sub-headers (## or bold text with **)
              if (trimmedLine.startsWith('##') || (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && !trimmedLine.includes(':'))) {
                const headerText = trimmedLine.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                return (
                  <Typography 
                    key={index} 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'primary.dark',
                      mt: 2.5, 
                      mb: 1,
                      fontSize: '1.05rem',
                      borderLeft: '4px solid #667eea',
                      pl: 1.5,
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      py: 0.5,
                      borderRadius: '4px'
                    }}
                  >
                    {headerText}
                  </Typography>
                );
              }

              // Bullet points with special formatting
              if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•')) {
                const text = trimmedLine.replace(/^[-*•]\s*/, '');
                const parts = [];
                let lastIndex = 0;
                
                // Parse bold text (**text**)
                const boldRegex = /\*\*([^*]+)\*\*/g;
                let match;
                
                while ((match = boldRegex.exec(text)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push({ text: text.substring(lastIndex, match.index), bold: false });
                  }
                  parts.push({ text: match[1], bold: true });
                  lastIndex = match.index + match[0].length;
                }
                
                if (lastIndex < text.length) {
                  parts.push({ text: text.substring(lastIndex), bold: false });
                }

                return (
                  <Box key={index} sx={{ display: 'flex', gap: 1.5, mb: 1, pl: 2 }}>
                    <Box 
                      sx={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        bgcolor: '#667eea',
                        mt: 1,
                        flexShrink: 0
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        lineHeight: 1.8,
                        color: 'text.primary',
                        fontSize: '0.95rem'
                      }}
                    >
                      {parts.length > 0 ? (
                        parts.map((part, i) => (
                          part.bold ? (
                            <Box 
                              key={i} 
                              component="span" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#667eea',
                                textDecoration: 'underline',
                                textDecorationColor: 'rgba(102, 126, 234, 0.3)',
                                textDecorationThickness: '2px',
                                textUnderlineOffset: '2px'
                              }}
                            >
                              {part.text}
                            </Box>
                          ) : (
                            <Box key={i} component="span">{part.text}</Box>
                          )
                        ))
                      ) : text}
                    </Typography>
                  </Box>
                );
              }

              // Numbered lists with enhanced styling
              if (/^\d+\./.test(trimmedLine)) {
                const match = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
                if (match) {
                  const [, number, text] = match;
                  const parts = [];
                  let lastIndex = 0;
                  
                  const boldRegex = /\*\*([^*]+)\*\*/g;
                  let boldMatch;
                  
                  while ((boldMatch = boldRegex.exec(text)) !== null) {
                    if (boldMatch.index > lastIndex) {
                      parts.push({ text: text.substring(lastIndex, boldMatch.index), bold: false });
                    }
                    parts.push({ text: boldMatch[1], bold: true });
                    lastIndex = boldMatch.index + boldMatch[0].length;
                  }
                  
                  if (lastIndex < text.length) {
                    parts.push({ text: text.substring(lastIndex), bold: false });
                  }

                  return (
                    <Box key={index} sx={{ display: 'flex', gap: 1.5, mb: 1.5, pl: 2 }}>
                      <Box 
                        sx={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          bgcolor: '#667eea',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        {number}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          lineHeight: 1.8,
                          color: 'text.primary',
                          fontSize: '0.95rem',
                          flex: 1
                        }}
                      >
                        {parts.length > 0 ? (
                          parts.map((part, i) => (
                            part.bold ? (
                              <Box 
                                key={i} 
                                component="span" 
                                sx={{ 
                                  fontWeight: 700, 
                                  color: '#667eea',
                                  textDecoration: 'underline',
                                  textDecorationColor: 'rgba(102, 126, 234, 0.3)',
                                  textDecorationThickness: '2px',
                                  textUnderlineOffset: '2px'
                                }}
                              >
                                {part.text}
                              </Box>
                            ) : (
                              <Box key={i} component="span">{part.text}</Box>
                            )
                          ))
                        ) : text}
                      </Typography>
                    </Box>
                  );
                }
              }

              // Regular paragraph text with bold formatting
              const parts = [];
              let lastIndex = 0;
              const boldRegex = /\*\*([^*]+)\*\*/g;
              let match;
              
              while ((match = boldRegex.exec(trimmedLine)) !== null) {
                if (match.index > lastIndex) {
                  parts.push({ text: trimmedLine.substring(lastIndex, match.index), bold: false });
                }
                parts.push({ text: match[1], bold: true });
                lastIndex = match.index + match[0].length;
              }
              
              if (lastIndex < trimmedLine.length) {
                parts.push({ text: trimmedLine.substring(lastIndex), bold: false });
              }

              return (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ 
                    mb: 1.5, 
                    lineHeight: 1.8,
                    color: 'text.primary',
                    fontSize: '0.95rem'
                  }}
                >
                  {parts.length > 0 ? (
                    parts.map((part, i) => (
                      part.bold ? (
                        <Box 
                          key={i} 
                          component="span" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#667eea',
                            bgcolor: 'rgba(102, 126, 234, 0.08)',
                            px: 0.5,
                            py: 0.2,
                            borderRadius: '3px'
                          }}
                        >
                          {part.text}
                        </Box>
                      ) : (
                        <Box key={i} component="span">{part.text}</Box>
                      )
                    ))
                  ) : trimmedLine}
                </Typography>
              );
            })}
          </Box>
        </CardContent>
      </Card>

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

