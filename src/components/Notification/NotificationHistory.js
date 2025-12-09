import React, { useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, IconButton } from '@mui/material';
import { NotificationContext } from '../../context/NotificationContext';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon sx={{ color: 'success.main' }} />;
    case 'error':
      return <ErrorIcon sx={{ color: 'error.main' }} />;
    case 'warning':
      return <WarningIcon sx={{ color: 'warning.main' }} />;
    case 'info':
    default:
      return <InfoIcon sx={{ color: 'info.main' }} />;
  }
};

const NotificationHistory = ({ onClose }) => {
  const { notifications } = useContext(NotificationContext);

  return (
    <Paper 
      sx={{ 
        position: 'absolute',
        top: '60px', // Position below the header
        right: '60px',
        width: 360,
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: (theme) => theme.zIndex.modal + 1,
        boxShadow: 3,
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" component="div">
          Thông Báo
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List dense>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText primary="No new notifications" />
          </ListItem>
        ) : (
          [...notifications].reverse().map((notification) => ( // Create a reversed copy for mapping
            <ListItem key={notification.id} divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'transparent' }}>
                  <NotificationIcon type={notification.type} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={notification.message} 
                primaryTypographyProps={{ sx: { color: 'text.primary' } }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default NotificationHistory;
