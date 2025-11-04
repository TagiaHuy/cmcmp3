import React from 'react';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Avatar, Paper } from '@mui/material';

const NowPlaying = () => {
  const { currentTrack } = useMediaPlayer();
  const theme = useTheme();

  if (!currentTrack) {
    return null; // Không hiển thị gì nếu không có bài hát nào đang phát
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
        Đang phát
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant="rounded"
          src={currentTrack.imageUrl}
          alt={currentTrack.title}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }} noWrap>
            {currentTrack.title}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }} noWrap>
            {currentTrack.artists}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default NowPlaying;
