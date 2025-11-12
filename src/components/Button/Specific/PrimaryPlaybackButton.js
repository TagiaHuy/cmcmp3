import React from 'react';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const PrimaryPlaybackButton = ({ isPlaying, handlePlayPause }) => (
  <IconButton 
    color="primary"
    onClick={handlePlayPause} 
    sx={{ 
      width: 64, 
      height: 64,
      bgcolor: 'primary.main',
      color: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      '&:hover': {
        bgcolor: 'primary.dark',
      },
    }}
  >
    {isPlaying ? <PauseIcon sx={{ fontSize: 32 }} /> : <PlayArrowIcon sx={{ fontSize: 32 }} />}
  </IconButton>
);

export default PrimaryPlaybackButton;
