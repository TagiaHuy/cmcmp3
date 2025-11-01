import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CMCMp3
        </Typography>
        {/* Future components like Search, User Button will go here */}
        <Box>
          {/* Placeholder for other components */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
