import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Analysis = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Skill Gap Analysis
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Gap analysis coming soon...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Here you'll be able to analyze skill gaps for specific job roles.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Analysis;
