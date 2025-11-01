import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Search from '../components/Search/Search';
import UpgradeButton from '../components/Button/Specific/UpgradeButton';
import SettingButton from '../components/Button/Specific/SettingButton';
import UserAccountButton from '../components/Button/Specific/UserAccountButton';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Search />
          <UpgradeButton />
          <SettingButton />
          <UserAccountButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
