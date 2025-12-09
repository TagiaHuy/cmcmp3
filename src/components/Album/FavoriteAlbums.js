import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useFavoriteAlbums from '../../hooks/useFavoriteAlbums';
import AlbumList from './AlbumList';

const FavoriteAlbums = () => {
  const { albums, loading, error } = useFavoriteAlbums();

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
  
  if (albums.length === 0) {
    return <Typography sx={{ textAlign: 'center', py: 5 }} color="text.primary">Bạn chưa có album yêu thích nào.</Typography>;
  }

  return <AlbumList albums={albums} />;
};

export default FavoriteAlbums;
