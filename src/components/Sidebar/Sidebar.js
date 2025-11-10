// src/components/Sidebar/index.js
import React from 'react';
import {
  Drawer, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const drawerWidth = 280;

function Sidebar({ anchor, items, logoComponent, bottomPadding = 84 }) {
  const isRight = anchor === 'right';
  const location = useLocation();

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

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 1,
          pb: isRight ? 0 : `${bottomPadding}px`,
          ...(isRight && {
            height: 'calc(100vh - var(--player-h, 0px))',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,.28) transparent',
            scrollbarGutter: 'stable both-edges',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent', marginBlock: 4 },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,.28)', borderRadius: 999 },
            '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,.4)' },
            '&::-webkit-scrollbar-thumb:active': { background: 'rgba(255,255,255,.55)' },
            '&::after': { content: '""', display: 'block', height: 'var(--player-h, 0px)' },
          }),
        }}
      >
        <List dense>
          {items.map((item) => {
            const selected =
              item.to && (location.pathname === item.to || location.pathname.startsWith(item.to));
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={item.to ? RouterLink : 'button'}
                  to={item.to || undefined}
                  selected={!!selected}
                >
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
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
