import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoriteAlbums from '../Album/FavoriteAlbums';
import UserAlbums from '../Album/UserAlbums';
import { useAuth } from '../../context/AuthContext';

const AlbumsTab = () => {
  const [view, setView] = useState('favorites');
  const { canCreateAlbum } = useAuth(); // ✅ CHỈ LẤY CÁI NÀY

  useEffect(() => {
    if (view === 'user_created' && !canCreateAlbum) {
      setView('favorites');
    }
  }, [view, canCreateAlbum]);

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonGroup size="small" sx={{ mb: 2 }}>
        <Button
          variant={view === 'favorites' ? 'contained' : 'outlined'}
          onClick={() => setView('favorites')}
        >
          Yêu thích
        </Button>

        {canCreateAlbum && (
          <Button
            variant={view === 'user_created' ? 'contained' : 'outlined'}
            onClick={() => setView('user_created')}
          >
            Đã tải lên
          </Button>
        )}
      </ButtonGroup>

      {view === 'favorites'
        ? <FavoriteAlbums />
        : (canCreateAlbum ? <UserAlbums /> : null)}
    </Box>
  );
};

export default AlbumsTab;
