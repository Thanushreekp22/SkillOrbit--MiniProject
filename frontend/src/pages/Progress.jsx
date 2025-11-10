import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Progress = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Progress Tracking
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Progress tracking coming soon...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Here you'll be able to track your skill development progress over time.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Progress;
