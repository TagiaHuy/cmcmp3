import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import PlaylistCardSafe from '../Card/PlaylistCardSafe';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Re-add 'rows' prop, defaulting to 1 for backward compatibility.
const PlaylistCarousel = ({ title, playlists, columns = 3, rows = 1, onPlay, loadingPlaylistId }) => {
  const [startIndex, setStartIndex] = useState(0);
  
  // Calculate the total number of items visible per page.
  const itemsPerPage = columns * rows;

  // Reset startIndex when the layout geometry changes.
  React.useEffect(() => {
    setStartIndex(0);
  }, [columns, rows]);

  const handleNext = () => {
    setStartIndex((prev) =>
      // Paginate by the total items per page.
      Math.min(prev + itemsPerPage, playlists.length - itemsPerPage)
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) => 
      // Paginate by the total items per page.
      Math.max(prev - itemsPerPage, 0)
    );
  };

  // Slice the array to get the items for the current page.
  const visiblePlaylists = playlists.slice(startIndex, startIndex + itemsPerPage);

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

      {/* Grid list - The 'xs' logic remains the same. Grid will handle wrapping to create rows. */}
      <Grid container spacing={4} justifyContent="center">
        {visiblePlaylists.map((playlist) => (
          <Grid item key={playlist.id} xs={12 / columns}>
            <PlaylistCardSafe
              playlist={playlist}
              onPlay={() => onPlay(playlist)}
              isLoading={loadingPlaylistId === playlist.id}
            />
          </Grid>
        ))}
      </Grid>

      {/* Button Next */}
      <IconButton
        onClick={handleNext}
        // The disable logic must now use itemsPerPage.
        disabled={startIndex + itemsPerPage >= playlists.length}
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