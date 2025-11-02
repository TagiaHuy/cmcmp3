import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import PlaylistCard from '../Card/PlaylistCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PlaylistCarousel = ({ title, playlists, columns = 3 }) => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + columns, playlists.length - columns));
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - columns, 0));
  };

  const visiblePlaylists = playlists.slice(startIndex, startIndex + columns);

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: (theme) => theme.palette.text.primary }}>
          {title}
        </Typography>
      )}
      <IconButton 
        onClick={handlePrev}
        disabled={startIndex === 0}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <Grid container spacing={5} justifyContent="center">
        {visiblePlaylists.map((playlist, index) => (
          <Grid item key={index} xs={12 / columns}>
            <PlaylistCard
              title={playlist.title}
              artists={playlist.artists}
              imageUrl={playlist.imageUrl}
            />
          </Grid>
        ))}
      </Grid>
      <IconButton 
        onClick={handleNext}
        disabled={startIndex + columns >= playlists.length}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default PlaylistCarousel;