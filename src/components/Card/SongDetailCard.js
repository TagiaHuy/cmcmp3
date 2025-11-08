import React from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PlayallButton from '../Button/Specific/PlayallButton';

const SongDetailCard = ({ song }) => {
  const { handlePlay, currentTrack } = useMediaPlayer();
  const isPlaying = currentTrack && currentTrack.title === song.title;

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
      <Typography variant="h4" component="h1" color="text.secondary" gutterBottom>
        {song.title}
      </Typography>
      <Typography variant="h6" component="h2" color="text.secondary" gutterBottom>
        {song.artists}    v          
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <PlayallButton isPlaying={isPlaying} handlePlayPause={() => handlePlay(song)} />
        <FavoriteButton />
      </Box>
    </Box>
  );
};

export default SongDetailCard;
