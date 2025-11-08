import React from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import PlayallButton from '../Button/Specific/PlayallButton';

const PlaylistDetailCard = ({ playlist }) => {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        component="img"
        sx={{
          width: 300,
          height: 300,
          objectFit: 'cover',
          borderRadius: 2,
          mb: 3,
        }}
        src={playlist.imageUrl}
        alt={playlist.name}
      />
      <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
        {playlist.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {playlist.description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <PlayallButton />
        <FavoriteButton />
        <MoreButton />
      </Box>
    </Box>
  );
};

export default PlaylistDetailCard;
