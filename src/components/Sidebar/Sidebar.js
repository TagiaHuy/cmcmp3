import React from 'react';
import {
  Drawer, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box
} from '@mui/material';

const drawerWidth = 280;

function Sidebar({ anchor, items, logoComponent, bottomPadding = 84 }) {
  const isRight = anchor === 'right';

  return (
    <Drawer
      variant="permanent"
      anchor={anchor}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',

          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',

          backgroundColor: (theme) =>
            anchor === 'left' ? theme.sidebarLeft.background : theme.sidebarRight.background,
          color: (theme) =>
            anchor === 'left' ? theme.sidebarLeft.textColor : theme.sidebarRight.textColor,
        },
      }}
    >
      {logoComponent}
      <Toolbar />

      {/* Vùng cuộn */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,

          /* Luôn có thanh cuộn */
          overflowY: 'scroll',

          /* Sidebar trái vẫn chừa padding đáy theo prop,
             Sidebar phải dùng spacer nên không cần pb */
          px: 1,
          pb: isRight ? 0 : `${bottomPadding}px`,

          /* Sidebar phải: trừ chiều cao player & thêm spacer cuối */
          ...(isRight && {
            /* Chiều cao thực để không bị player (fixed) che */
            height: 'calc(100vh - var(--player-h, 0px))',

            /* Scrollbar nhỏ kiểu ZingMP3 */
            position: 'relative',
            scrollbarWidth: 'thin',                         // Firefox
            scrollbarColor: 'rgba(255,255,255,.28) transparent',
            scrollbarGutter: 'stable both-edges',
            '&::-webkit-scrollbar': { width: 4 },           // Chrome/Edge
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
              marginBlock: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,.28)',
              borderRadius: 999,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255,255,255,.4)',
            },
            '&::-webkit-scrollbar-thumb:active': {
              background: 'rgba(255,255,255,.55)',
            },

            /* Ép tràn + spacer cuối đúng bằng chiều cao player */
            '&::after': {
              content: '""',
              display: 'block',
              height: 'var(--player-h, 0px)', // ví dụ 100px khi player đang phát
            },
          }),
        }}
      >
        <List dense>
          {items.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    color: (theme) =>
                      anchor === 'left'
                        ? theme.sidebarLeft.iconColor
                        : theme.sidebarRight.iconColor,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* thêm NowPlaying / SuggestionList ở đây nếu cần */}
      </Box>
    </Drawer>
  );
}

export default Sidebar;
