import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import PlaylistCardSafe from '../Card/PlaylistCardSafe';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PlaylistCarousel = ({ title, playlists, columns = 3, onPlay }) => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + columns, playlists.length - columns)
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - columns, 0));
  };

  const visiblePlaylists = playlists.slice(startIndex, startIndex + columns);

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
      {/* Header */}
      {title && (
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          {title}
        </Typography>
      )}

      {/* Button Prev */}
      <IconButton
        onClick={handlePrev}
        disabled={startIndex === 0}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Grid list */}
      <Grid container spacing={4} justifyContent="center">
        {visiblePlaylists.map((playlist) => (
          <Grid item key={playlist.id} xs={12 / columns}>
            <PlaylistCardSafe
              playlist={playlist}
              onPlay={() => onPlay(playlist)}   // ⭐ NHẤN MẠNH: TRUYỀN ĐÚNG CALLBACK
            />
          </Grid>
        ))}
      </Grid>

      {/* Button Next */}
      <IconButton
        onClick={handleNext}
        disabled={startIndex + columns >= playlists.length}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
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
