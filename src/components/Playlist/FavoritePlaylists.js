import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useFavoritePlaylists from '../../hooks/useFavoritePlaylists';
import PlaylistList from './PlaylistList';

const FavoritePlaylists = () => {
  const { playlists, loading, error } = useFavoritePlaylists();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>{error}</Typography>;
  }
  
  if (playlists.length === 0) {
    return <Typography sx={{ textAlign: 'center', py: 5 }} color="text.primary">Bạn chưa có playlist yêu thích nào.</Typography>;
  }

  return <PlaylistList playlists={playlists} />;
};

export default FavoritePlaylists;
