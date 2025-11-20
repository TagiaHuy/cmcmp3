// src/layout/Header.js
import React from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Search from '../components/Search/Search';
import UpgradeButton from '../components/Button/Specific/UpgradeButton';
import SettingButton from '../components/Button/Specific/SettingButton';
import Navigation from '../components/Navigation/Navigation';
import ThemeToggleButton from '../components/Button/Specific/ThemeToggleButton';

// ✅ Menu avatar tài khoản (đã tạo ở components/MenuItem/UserAvatarMenu.js)
import UserAvatarMenu from '../components/MenuItem/UserAvatarMenu';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Navigation />
          <Search />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <UpgradeButton />
          <IconButton sx={{ color: (theme) => theme.palette.text.primary }}>
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          <SettingButton />
          {/* ✅ Luôn hiển thị icon tài khoản; menu bên trong sẽ tự phân nhánh theo trạng thái đăng nhập */}
          <UserAvatarMenu />
          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
