import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaylistTabs from '../components/Playlist/PlaylistTabs';

const PlaylistsPage = () => {
  return (
    <Box sx={{ p: 0, pr: 4, width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 700 }}>
          Playlists
        </Typography>
      </Box>
      
      <PlaylistTabs />
    </Box>
  );
};

export default PlaylistsPage;
