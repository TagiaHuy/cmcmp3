import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';

const PlayableImage = ({ imageUrl, title, size = 130, borderRadius = '4px', sx, onPlay, playlist }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = (event) => {
    event.stopPropagation(); // Prevent the Box's onClick from firing if it had one
    if (onPlay && playlist) {
      onPlay(playlist);
    }
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: borderRadius,
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        },
        ...sx,
      }}
    >
      <Box 
        component="img" 
        src={imageUrl}  
        alt={title} 
      />
      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
            zIndex: 2, // Between image (1) and icon (3)
          }}
        />
      )}
      {isHovered && (
        <IconButton
          onClick={handlePlayClick}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            zIndex: 3,
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 40 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default PlayableImage;