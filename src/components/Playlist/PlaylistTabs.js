import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoritePlaylists from './FavoritePlaylists';
import UserPlaylists from './UserPlaylists';

const PlaylistTabs = () => {
  const [view, setView] = useState('user'); // 'user' or 'favorites'

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonGroup size="small" sx={{ mb: 2 }}>
        <Button
          variant={view === 'user' ? 'contained' : 'outlined'}
          onClick={() => setView('user')}
        >
          Playlist đã tạo
        </Button>
        <Button
          variant={view === 'favorites' ? 'contained' : 'outlined'}
          onClick={() => setView('favorites')}
        >
          Yêu thích
        </Button>
      </ButtonGroup>

      {view === 'user' ? <UserPlaylists /> : <FavoritePlaylists />}
    </Box>
  );
};

export default PlaylistTabs;
