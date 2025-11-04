import React from 'react';
import { Box } from '@mui/material';
import NowPlaying from './NowPlaying';
import SuggestionList from './SuggestionList';

function SidebarRight() {
  return (
    <Box
      sx={{
        overflowY: 'scroll',              // luôn hiện thanh cuộn
        height: 'calc(100vh - var(--player-h, 0px))',   // trừ chiều cao player
        position: 'relative',
        padding: '16px',
        borderLeft: '1px solid rgba(255,255,255,0.1)', // giống zingmp3
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable both-edges',
        position: 'relative',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '8px'
        },
        '&::after': {
          content: '""',
          display: 'block',
          height: 'var(--player-h, 0px)',
        }
      }}
    >
      <NowPlaying />
      <SuggestionList />
    </Box>
  );
}

export default SidebarRight;
