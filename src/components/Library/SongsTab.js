import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import FavoriteSongs from './FavoriteSongs';
import UploadedSongs from './UploadedSongs';

const SongsTab = () => {
  const [view, setView] = useState('favorites'); // 'favorites' or 'uploaded'

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
          variant={view === 'uploaded' ? 'contained' : 'outlined'}
          onClick={() => setView('uploaded')}
        >

          Đã tải lên
        </Button>
      </ButtonGroup>

      {view === 'favorites' ? <FavoriteSongs /> : <UploadedSongs />}
    </Box>
  );
};

export default SongsTab;
