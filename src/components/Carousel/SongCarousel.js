// src/components/Carousel/SongCarousel.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import SongCardDetailed from '../Card/SongCardDetailed';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Re-add 'rows' prop, defaulting to 1 for backward compatibility.
const SongCarousel = ({ title, songs = [], columns = 3, rows = 1, onPlay }) => {
  const [startIndex, setStartIndex] = useState(0);
  const { normalizeArtists } = useMediaPlayer();

  // Calculate the total number of items visible per page.
  const itemsPerPage = columns * rows;

  // Reset startIndex when the layout geometry changes.
  React.useEffect(() => {
    setStartIndex(0);
  }, [columns, rows]);

  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Không có bài hát.</Typography>
      </Box>
    );
  }

  const maxIndex = Math.max(0, songs.length - itemsPerPage);

  const handleNext = () => {
    // Paginate by the total items per page.
    setStartIndex((prev) => Math.min(prev + itemsPerPage, maxIndex));
  };

  const handlePrev = () => {
    // Paginate by the total items per page.
    setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  // Slice the array to get the items for the current page.
  const visibleSongs = songs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
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

      {/* Nút Previous */}
      <IconButton
        onClick={handlePrev}
        disabled={startIndex === 0}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.3)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Danh sách bài hát */}
      <Grid container spacing={4} justifyContent="center">
        {visibleSongs.map((song) => (
          <Grid item key={song.id || song.mediaSrc} xs={12 / columns}>
            <SongCardDetailed
              song={song}
              normalizeArtists={normalizeArtists}
              onPlay={() => onPlay?.(song)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Nút Next */}
      <IconButton
        onClick={handleNext}
        disabled={startIndex >= maxIndex}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
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