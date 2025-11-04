import React from 'react';
import { Box } from '@mui/material';
import NowPlaying from './NowPlaying';

function SidebarRight() {
  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <NowPlaying />
      {/* Các thành phần khác của sidebar phải có thể được thêm vào đây trong tương lai */}
    </Box>
  );
}

export default SidebarRight;
