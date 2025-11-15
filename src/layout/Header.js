// src/layout/Header.js
import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Search from '../components/Search/Search';
import UpgradeButton from '../components/Button/Specific/UpgradeButton';
import SettingButton from '../components/Button/Specific/SettingButton';
import Navigation from '../components/Navigation/Navigation';
import ThemeToggleButton from '../components/Button/Specific/ThemeToggleButton';
import UserAvatarMenu from '../components/MenuItem/UserAvatarMenu';

function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: (theme) => alpha(theme.header.background, 0.8),
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Bên trái: nút back/next + search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Navigation />
          <Search />
        </Box>

        {/* Bên phải: nút nâng cấp, setting, avatar, toggle theme */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <UpgradeButton />
          <SettingButton />

          {/* ✅ Avatar góc phải – tự dùng useAuth bên trong */}
          <UserAvatarMenu />

          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
