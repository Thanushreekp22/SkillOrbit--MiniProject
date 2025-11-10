import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Roles = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Job Roles
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Roles management coming soon...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Here you'll be able to manage job roles and their skill requirements.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Roles;
