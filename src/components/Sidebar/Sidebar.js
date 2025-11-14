// src/components/Sidebar/index.js
import React from 'react';
import {
  Drawer, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, Typography
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const drawerWidth = 280;

function Sidebar({ anchor, items, logoComponent, bottomPadding = 84, sxItem, sxSection }) {
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
            isRight ? theme.sidebarRight.background : theme.sidebarLeft.background,
          color: (theme) =>
            isRight ? theme.sidebarRight.textColor : theme.sidebarLeft.textColor,
          borderRight: isRight ? 'none' : '1px solid rgba(255,255,255,0.08)',
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
          px: 1.3,
          pb: isRight ? 0 : `${bottomPadding}px`,
          ...(isRight && {
            height: 'calc(100vh - var(--player-h, 0px))',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,.28) transparent',
            scrollbarGutter: 'stable both-edges',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent', marginBlock: 4 },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,.22)', borderRadius: 999 },
            '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,.33)' },
            '&::-webkit-scrollbar-thumb:active': { background: 'rgba(255,255,255,.5)' },
            '&::after': { content: '""', display: 'block', height: 'var(--player-h, 0px)' },
          }),
        }}
      >
        <List dense sx={{ px: 0.4 }}>
          {items.map((item, index) => {
            // -------- SECTION LABEL ----------
            if (item.section) {
              return (
                <Typography
                  key={`section-${index}`}
                  sx={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    color: 'rgba(255,255,255,0.45)',
                    mt: index === 0 ? 0 : 2.6,
                    mb: 0.8,
                    px: 1.3,
                    ...(sxSection || {}),
                  }}
                >
                  {item.section}
                </Typography>
              );
            }

            // -------- ITEM (LINK / BUTTON) ----------
            const selected =
              item.to &&
              (location.pathname === item.to ||
                location.pathname.startsWith(item.to));

            return (
              <ListItem key={item.text || index} disablePadding>
                <ListItemButton
                  component={item.to ? RouterLink : 'button'}
                  to={item.to || undefined}
                  onClick={item.onClick}
                  selected={selected}
                  sx={{
                    borderRadius: '10px',
                    py: 1.1,
                    px: 1.6,
                    mb: 0.4,
                    transition: '0.25s ease',
                    color: selected ? 'white' : 'rgba(255,255,255,0.85)',
                    background: selected
                      ? 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
                      : 'transparent',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(6px)',
                      transform: 'translateX(4px)',
                    },
                    ...(sxItem || {}),
                  }}
                >
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 38,
                        color: selected
                          ? 'white'
                          : (theme) =>
                              isRight
                                ? theme.sidebarRight.iconColor
                                : theme.sidebarLeft.iconColor,
                        transition: '0.25s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.96rem',
                      fontWeight: selected ? 600 : 500,
                    }}
                  />
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
