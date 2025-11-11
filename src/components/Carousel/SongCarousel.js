import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import SongCardDetailed from '../Card/SongCardDetailed'; // Use the new detailed card
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SongCarousel = ({ title, songs, columns = 3, onPlay }) => { // Accept onPlay prop
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + columns, songs.length - columns));
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - columns, 0));
  };

  const visibleSongs = songs.slice(startIndex, startIndex + columns);

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
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <Grid container spacing={5} justifyContent="center">
        {visibleSongs.map((song, index) => ( // Add index for onPlay
          <Grid item key={song.id} xs={12 / columns}>
            <SongCardDetailed song={song} onPlay={(s) => onPlay(s, startIndex + index)} /> {/* Pass onPlay */}
          </Grid>
        ))}
      </Grid>
      <IconButton
        onClick={handleNext}
        disabled={startIndex + columns >= songs.length}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default SongCarousel;
