import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaylistTabs from '../components/Playlist/PlaylistTabs';

const PlaylistsPage = () => {
  return (
    <Box sx={{ p: 3, pr: 4, width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
          Playlists
        </Typography>
      </Box>
      
      <PlaylistTabs />
    </Box>
  );
};

export default PlaylistsPage;
