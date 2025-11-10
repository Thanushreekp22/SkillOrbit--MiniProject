import React from 'react';

const SkillOrbitIcon = ({ size = 48, variant = 'gradient' }) => {
  const colors = {
    gradient: {
      primary: '#6366F1',
    },
    white: {
      primary: '#FFFFFF',
    },
    dark: {
      primary: '#1E293B',
    },
  };

  const c = colors[variant] || colors.gradient;

  return (
    <svg
      width={size}
      height={size}
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
  );
};

export default SkillOrbitIcon;
