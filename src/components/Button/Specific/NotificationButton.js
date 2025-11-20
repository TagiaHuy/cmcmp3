// src/components/Button/Specific/NotificationButton.js
import React, { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useNotifications } from '../../../context/NotificationContext';
import NotificationPanel from '../../Notifications/NotificationPanel';

function NotificationButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { unreadCount } = useNotifications();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        aria-label="show new notifications"
        onClick={handleClick}
        sx={{
          backgroundColor: (theme) => theme.Button.background,
          color: (theme) => theme.Button.iconColor,
          '&:hover': {
            backgroundColor: (theme) => theme.Button.hoverBackground,
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>
      <NotificationPanel
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}

export default NotificationButton;
