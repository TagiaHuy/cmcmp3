import React from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import useSongsByIds from '../../hooks/useSongsByIds';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PlaylistCard from './PlaylistCard'; // Import PlaylistCard

const PlaylistView = ({ playlist }) => {
  const { songs, loading, error } = useSongsByIds(playlist.songs);
  const { handlePlay } = useMediaPlayer();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching songs in playlist.</Typography>;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5">{playlist.name}</Typography>
      <Typography variant="body1" color="text.secondary">{playlist.description}</Typography>
      <List>
        {songs.map(song => (
          <Box key={song.id} sx={{ mb: 2 }}>
            <PlaylistCard playlist={song} onPlay={() => handlePlay(song)} />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default PlaylistView;
