import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import AlbumList from './AlbumList';
import useUserAlbums from '../../hooks/useUserAlbums';

const UserAlbums = () => {
  const { albums, loading, error } = useUserAlbums();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Lỗi: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Omitting 'Create Album' button for now, as per the initial request scope */}
      {albums.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
          Bạn chưa có album nào.
        </Typography>
      ) : (
        <AlbumList albums={albums} />
      )}
    </Box>
  );
};

export default UserAlbums;
