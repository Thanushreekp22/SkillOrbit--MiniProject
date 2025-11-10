import React from 'react';
import { Box } from '@mui/material';

const SkillOrbitLogo = ({ variant = 'light', size = 'medium', withText = true }) => {
  const sizes = {
    small: { icon: 36, text: 100, fontSize: 18 },
    medium: { icon: 48, text: 140, fontSize: 24 },
    large: { icon: 64, text: 180, fontSize: 32 },
    xlarge: { icon: 80, text: 220, fontSize: 40 },
  };

  const { icon: iconSize, text: textWidth, fontSize } = sizes[size] || sizes.medium;

  // Colors based on variant
  const colors = {
    light: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      accent: '#FFFFFF',
      ring: 'rgba(255,255,255,0.8)',
      core: 'rgba(255,255,255,0.9)',
      text: '#FFFFFF',
    },
    dark: {
      primary: '#6366F1',
      secondary: '#0EA5E9',
      accent: '#8B5CF6',
      ring: '#818CF8',
      core: '#A78BFA',
      text: '#1E293B',
    },
  };

  const c = colors[variant];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bold Outer Circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke={c.primary}
          strokeWidth="5"
          fill="none"
        />

        {/* Bold "S" Shape for Skill */}
        <path
          d="M 35 30 Q 25 30 25 40 Q 25 50 35 50 L 65 50 Q 75 50 75 60 Q 75 70 65 70"
          stroke={c.primary}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Three Orbit Dots */}
        <circle cx="50" cy="15" r="6" fill={c.primary} />
        <circle cx="85" cy="50" r="6" fill={c.primary} />
        <circle cx="50" cy="85" r="6" fill={c.primary} />
      </svg>

      {withText && (
        <Box
          component="span"
          sx={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 800,
            color: c.text,
            letterSpacing: '0.5px',
            textShadow: variant === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          SkillOrbit
        </Box>
      )}
    </Box>
  );
};

export default SkillOrbitLogo;
