import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const LearningPath = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Learning Path
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Learning paths coming soon...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Here you'll get personalized learning recommendations based on your skill gaps.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LearningPath;
