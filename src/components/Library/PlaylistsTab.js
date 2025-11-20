import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoritePlaylists from '../Playlist/FavoritePlaylists';
import UserPlaylists from '../Playlist/UserPlaylists';

const PlaylistsTab = () => {
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

      {view === 'favorites' ? <FavoritePlaylists /> : <UserPlaylists />}
    </Box>
  );
};

export default PlaylistsTab;