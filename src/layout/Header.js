import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Search from '../components/Search/Search';
import UpgradeButton from '../components/Button/Specific/UpgradeButton';
import SettingButton from '../components/Button/Specific/SettingButton';
import UserAccountButton from '../components/Button/Specific/UserAccountButton';
import Navigation from '../components/Navigation/Navigation';
import ThemeToggleButton from '../components/Button/Specific/ThemeToggleButton';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Header() {
  const { isAuthenticated, user, logout } = useAuth(); // Sử dụng auth context

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
          <SettingButton />
          {isAuthenticated && user ? (
            <>
              <Typography sx={{ color: (theme) => theme.palette.text.primary }}>
                Chào, {user.displayName}
              </Typography>
              <Button variant="contained" onClick={logout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <UserAccountButton />
          )}
          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
