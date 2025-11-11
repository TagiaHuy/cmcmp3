import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function UserAccountMenu({ anchorEl, open, handleClose }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/'); // Redirect to home page after logout
  };

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
      {isAuthenticated ? (
        [
          <MenuItem 
            key="profile"
            component={Link} 
            to="/profile"
            onClick={handleClose} 
            sx={{ color: (theme) => theme.Button.textColor, textDecoration: 'none' }}
          >
            <AccountCircleIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
            Hồ sơ cá nhân
          </MenuItem>,
          <Divider key="divider" sx={{ backgroundColor: (theme) => theme.Button.divider, margin: '8px 0' }} />,
          <MenuItem 
            key="logout"
            onClick={handleLogout} 
            sx={{ color: (theme) => theme.Button.textColor, textDecoration: 'none' }}
          >
            <LogoutIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
            Đăng xuất
          </MenuItem>
        ]
      ) : (
        [
          <MenuItem 
            key="login"
            component={Link} 
            to="/login"
            onClick={handleClose} 
            sx={{ color: (theme) => theme.Button.textColor, textDecoration: 'none' }}
          >
            <LoginIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
            Đăng nhập
          </MenuItem>,
          <Divider key="divider" sx={{ backgroundColor: (theme) => theme.Button.divider, margin: '8px 0' }} />,
          <MenuItem 
            key="register"
            component={Link} 
            to="/register"
            onClick={handleClose} 
            sx={{ color: (theme) => theme.Button.textColor, textDecoration: 'none' }}
          >
            <PersonAddIcon sx={{ color: (theme) => theme.Button.textColor, mr: 1 }} />
            Đăng ký
          </MenuItem>
        ]
      )}
    </Menu>
  );
}

export default UserAccountMenu;