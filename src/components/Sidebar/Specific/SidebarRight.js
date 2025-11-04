import React from 'react';
import { Box } from '@mui/material';
import NowPlaying from './NowPlaying';
import SuggestionList from './SuggestionList';

function SidebarRight() {
  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: 'calc(100vh - var(--player-h, 0px))',
        borderLeft: '1px solid rgba(255,255,255,0.1)',

        // 🔥 SÁT TRÁI & SÁT PHẢI
        p: 0,

        // Scrollbar
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable both-edges',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '8px'
        },

        // Chừa chỗ cho player dưới
        '&::after': {
          content: '""',
          display: 'block',
          height: 'var(--player-h, 0px)',
        },

        // 🔥 Loại hết padding thừa của List và ListItem
        '& .MuiList-root': {
          paddingLeft: 0,
          paddingRight: 0
        },
        '& .MuiListItem-root': {
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0
        }
      }}
    >
      <NowPlaying />
      <SuggestionList />
    </Box>
  );
}

export default SidebarRight;
