import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Banner = ({ imageUrl, title, description, onButtonClick, buttonText }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 110,
        marginLeft: 11,  
        marginRight: 11,                                                                     
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        p: 3,
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        },
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
          backgroundColor: 'rgba(207, 203, 203, 0.5)', // Dark overlay
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {title}
        </Typography>
        <Typography variant="body2" mb={2}>
          {description}
        </Typography>
        {onButtonClick && buttonText && (
          <Button variant="contained" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Banner;
