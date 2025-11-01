import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Search from '../Search/Search';

function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => alpha(theme.header.background, 0.8),
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CMCMp3
        </Typography>
        <Search />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
