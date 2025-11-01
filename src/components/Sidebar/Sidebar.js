import React from 'react';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';

const drawerWidth = 240;

function Sidebar({ anchor, items }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: (theme) => anchor === 'left' ? theme.sidebarLeft.background : theme.sidebarRight.background,
          color: (theme) => anchor === 'left' ? theme.sidebarLeft.textColor : theme.sidebarRight.textColor,
        },
      }}
      variant="permanent"
      anchor={anchor}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: (theme) => anchor === 'left' ? theme.sidebarLeft.iconColor : theme.sidebarRight.iconColor }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;