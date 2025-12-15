import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoritePlaylists from '../Playlist/FavoritePlaylists';
import UserPlaylists from '../Playlist/UserPlaylists';
import { useAuth } from '../../context/AuthContext';

const PlaylistsTab = () => {
  const [view, setView] = useState('favorites'); // 'favorites' or 'user_created'
  const { canCreateAlbum } = useAuth(); // Using canCreateAlbum for now, assuming it implies canCreatePlaylist

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
        ? <FavoritePlaylists />
        : (canCreateAlbum ? <UserPlaylists /> : null)}
    </Box>
  );
};

export default PlaylistsTab;