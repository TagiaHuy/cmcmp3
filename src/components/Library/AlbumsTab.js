import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoriteAlbums from '../Album/FavoriteAlbums';
import UserAlbums from '../Album/UserAlbums';

const AlbumsTab = () => {
  const [view, setView] = useState('favorites'); // 'favorites' or 'user_created'

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonGroup size="small" sx={{ mb: 2 }}>
        <Button
          variant={view === 'favorites' ? 'contained' : 'outlined'}
          onClick={() => setView('favorites')}
        >
          Yêu thích
        </Button>
        <Button
          variant={view === 'user_created' ? 'contained' : 'outlined'}
          onClick={() => setView('user_created')}
        >
          Đã tạo
        </Button>
      </ButtonGroup>

      {view === 'favorites' ? <FavoriteAlbums /> : <UserAlbums />}
    </Box>
  );
};

export default AlbumsTab;