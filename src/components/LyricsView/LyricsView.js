import React from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import LyricsDisplay from '../LyricsDisplay';

const LyricsView = () => {
  const { isLyricsVisible, toggleLyrics, currentTrack, currentTime } = useMediaPlayer();

  if (!isLyricsVisible) {
    return null;
  }

  return (
    <Paper
      elevation={10}
      sx={{
        position: 'fixed',
        bottom: 100, // Position above the media player
        right: 20,
        width: '400px',
        height: '60vh',
        zIndex: 1400, // Higher than other elements
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        borderRadius: 2,
        backdropFilter: 'blur(14px)',
        background: 'rgba(20, 20, 20, 0.75)',
        border: '1px solid #333',
        color: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Lyrics</Typography>
        <IconButton onClick={toggleLyrics} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <LyricsDisplay lyrics={currentTrack?.lyrics} currentTime={currentTime} />
    </Paper>
  );
};

export default LyricsView;
