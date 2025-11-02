import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function UserAccountMenu({ anchorEl, open, handleClose }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.Button.background,
          borderRadius: '12px',
          width: 200,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={handleClose} sx={{ color: (theme) => theme.Button.textColor }}>
        <AccountBoxIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
        Profile
      </MenuItem>
      <Divider sx={{ backgroundColor: (theme) => theme.Button.divider, margin: '8px 0' }} />
      <MenuItem onClick={handleClose} sx={{ color: (theme) => theme.Button.textColor }}>
        <ExitToAppIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );
}

export default UserAccountMenu;