// src/components/Notifications/NotificationPanel.js
import React from 'react';
import { Menu, MenuItem, Typography, Box, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import CircleIcon from '@mui/icons-material/Circle';

// Function to format time nicely (e.g., "5m ago", "1h ago")
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const NotificationPanel = ({ anchorEl, open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    onClose(); // Close the panel
    if (!notification.read) {
      markAsRead([notification.id]);
    }
    navigate(notification.link || '/');
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 380,
          maxWidth: '90vw',
          maxHeight: 450,
          overflow: 'auto',
          mt: 1.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          Notifications
        </Typography>
        <Button size="small" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </Box>
      <Divider sx={{ mb: 1 }}/>

      {notifications.length === 0 ? (
        <Typography sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
          You have no notifications.
        </Typography>
      ) : (
        notifications.map((notif) => (
          <MenuItem
            key={notif.id}
            onClick={() => handleNotificationClick(notif)}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              py: 1.5,
              whiteSpace: 'normal',
              backgroundColor: notif.read ? 'transparent' : 'action.hover',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">{notif.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {timeSince(notif.createdAt)}
              </Typography>
            </Box>
            {!notif.read && (
              <CircleIcon sx={{ fontSize: 10, color: 'primary.main', mt: 0.5 }} />
            )}
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

export default NotificationPanel;
