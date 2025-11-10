import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, icon }) => {
  return (
    <Box mb={5}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant="h1"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
            background: 'linear-gradient(90deg, #6366F1 0%, #0EA5E9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            maxWidth: '800px',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
