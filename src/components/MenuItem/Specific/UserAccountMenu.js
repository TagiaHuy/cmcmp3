import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';

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
      <MenuItem 
        component={Link} 
        to="/login"
        onClick={handleClose} 
        sx={{ color: (theme) => theme.Button.textColor, textDecoration: 'none' }}
      >
        <LoginIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
        Đăng nhập
      </MenuItem>
      <Divider sx={{ backgroundColor: (theme) => theme.Button.divider, margin: '8px 0' }} />
      <MenuItem 
        component={Link} 
        to="/register"
        onClick={handleClose} 
        sx={{ color: (theme) => theme.Button.textColor, textDecoration: 'none' }}
      >
        <PersonAddIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
        Đăng ký
      </MenuItem>
    </Menu>
  );
}

export default UserAccountMenu;