import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import useSong from '../hooks/useSong';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import PlaybackControls from '../components/Button/Specific/PlaybackControls';
import FavoriteButton from '../components/Button/Specific/FavoriteButton';

const SongDetailPage = () => {
  const { songId } = useParams();
  const { song, loading, error } = useSong(songId);
  const { handlePlay } = useMediaPlayer();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching song details.</Typography>;
  }

  if (!song) {
    return <Typography>Song not found.</Typography>;
  }

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
        src={song.imageUrl}
        alt={song.title}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        {song.title}
      </Typography>
      <Typography variant="h6" component="h2" color="text.secondary" gutterBottom>
        {song.artists}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <PlaybackControls
          onPlay={() => handlePlay(song)}
          // onPause, onNext, onPrevious will be handled by the MediaPlayerContext
        />
        <FavoriteButton />
      </Box>
    </Box>
  );
};

export default SongDetailPage;
