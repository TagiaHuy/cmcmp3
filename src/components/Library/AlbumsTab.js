import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoriteAlbums from '../Album/FavoriteAlbums';
import UserAlbums from '../Album/UserAlbums';
import { useAuth } from '../../context/AuthContext';

const AlbumsTab = () => {
  const [view, setView] = useState('favorites'); // 'favorites' or 'user_created'
  const { user, hasRole } = useAuth();


  const canViewUploadedAlbums = user && (hasRole('ADMIN') || (hasRole('ARTIST') && user?.isVerifiedArtist));

  // If the view is 'user_created' but the user cannot view uploaded albums, default to 'favorites'
  useState(() => {
    if (view === 'user_created' && !canViewUploadedAlbums) {
      setView('favorites');
    }
  }, [view, canViewUploadedAlbums]);

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonGroup size="small" sx={{ mb: 2 }}>
        <Button
          variant={view === 'favorites' ? 'contained' : 'outlined'}
          onClick={() => setView('favorites')}
        >
          Yêu thích
        </Button>
        {canViewUploadedAlbums && (
          <Button
            variant={view === 'user_created' ? 'contained' : 'outlined'}
            onClick={() => setView('user_created')}
          >
            Đã tải lên
          </Button>
        )}
      </ButtonGroup>

      {view === 'favorites' ? <FavoriteAlbums /> : (canViewUploadedAlbums ? <UserAlbums /> : null)}
    </Box>
  );
};

export default AlbumsTab;