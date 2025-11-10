import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Reports = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Reports generation coming soon...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Here you'll be able to generate and download various skill assessment reports.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Reports;
