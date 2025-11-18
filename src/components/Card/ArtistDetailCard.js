import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import PlayallButton from '../Button/Specific/PlayallButton';

const ArtistDetailCard = ({ artist }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.background.artistCard,
        borderRadius: 3,
        boxShadow: 3,
        width: 300, // Adjust width for consistency across cards
        transition: 'transform 0.3s ease-in-out', // Smooth hover transition
        '&:hover': {
          transform: 'scale(1.05)', // Slight zoom effect on hover
          boxShadow: 6, // Enhance shadow on hover for depth
        },
      }}
    >
      <Box
        component="img"
        sx={{
          width: 250,
          height: 250,
          objectFit: 'cover',
          borderRadius: '50%',
          mb: 2,
          border: '4px solid', // Thicker border for more emphasis
          borderColor: theme.palette.primary.main,
          transition: 'transform 0.3s ease', // Zoom effect on hover
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
        src={artist.imageUrl}
        alt={artist.name}
      />
      
      <Typography variant="h4" component="h1" color="text.primary" sx={{ fontWeight: 700, textAlign: 'center' }}>
        {artist.name}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        {artist.songCount} Songs
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <PlayallButton
          size="large"
          variant="contained"
          sx={{
            minWidth: 150,
            borderRadius: 20, // More rounded for a modern look
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        />
        <FavoriteButton
          sx={{
            borderRadius: 20,
            '&:hover': {
              backgroundColor: theme.palette.secondary.light,
            },
          }}
        />
        <MoreButton
          sx={{
            borderRadius: 20,
            '&:hover': {
              backgroundColor: theme.palette.grey[200],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ArtistDetailCard;
