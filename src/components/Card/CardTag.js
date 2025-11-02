import React from 'react';
import { Typography } from '@mui/material';

const CardTag = ({ text }) => {
  return (
    <Typography 
        variant="caption" 
        sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            color: 'white', 
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '2px 6px',
            borderRadius: '14px',
            fontSize: '0.65rem',
            zIndex: 3,
        }}
    >
        {text}
    </Typography>
  );
};

export default CardTag;