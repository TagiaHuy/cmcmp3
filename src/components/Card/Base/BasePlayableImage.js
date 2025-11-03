import React from 'react';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';

const BasePlayableImage = ({ children, onPlay, mediaSrc, size = 130, borderRadius = '4px', sx, isHovered, onMouseEnter, onMouseLeave }) => {

  const handlePlayClick = (event) => {
    event.stopPropagation();
    if (onPlay && mediaSrc) {
      onPlay(mediaSrc);
    }
  };

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: borderRadius,
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        ...sx,
      }}
    >
      {children}
      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2,
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

export default BasePlayableImage;
