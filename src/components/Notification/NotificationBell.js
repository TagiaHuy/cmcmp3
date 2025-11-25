import React, { useState } from 'react';
import { 
    Badge, Menu, MenuItem, Typography, 
    List, ListItem, ListItemAvatar, Avatar, ListItemText, Box 
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NormalButton from '../Button/NormalButton';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // format thời gian

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        if (unreadCount > 0) {
            markAllAsRead();
        }
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (noti) => {
        if (!noti.read) {
            markAsRead(noti.id);
        }
        
        // Điều hướng dựa trên loại thông báo
        if (noti.type === 'LIKE_SONG' || noti.type === 'COMMENT_SONG') {
            navigate(`/songs/${noti.referenceId}`);
        } else if (noti.type === 'LIKE_PLAYLIST' || noti.type === 'COMMENT_PLAYLIST') {
            navigate(`/playlist/${noti.referenceId}`);
        }
        
        handleClose();
    };

    return (
        <>
            <NormalButton onClick={handleClick}>
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            color: (theme) => theme.palette.common.white, // Ensure text is white
                            border: (theme) => `1px solid ${theme.palette.error.main}`, // Red border around the badge
                        },
                    }}
                >
                    <NotificationsIcon />
                </Badge>
            </NormalButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: (theme) => theme.Button.background,
                        borderRadius: '12px',
                        width: 360,
                        maxHeight: 400,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    },
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >


                {notifications.length === 0 ? (
                    <MenuItem disabled sx={{ color: (theme) => theme.Button.textColor }}>Không có thông báo nào</MenuItem>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((noti) => (
                            <ListItem 
                                button 
                                key={noti.id} 
                                onClick={() => handleItemClick(noti)}
                                sx={{
                                    color: (theme) => theme.Button.textColor,
                                    backgroundColor: noti.read ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.15),
                                    '&:hover': { 
                                        backgroundColor: (theme) => theme.Button.hoverBackground 
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={noti.senderAvatar} alt={noti.senderName} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={
                                        <Typography variant="body2" sx={{ fontWeight: noti.read ? 400 : 700, color: 'inherit' }}>
                                            {noti.message}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {moment(noti.createdAt).fromNow()}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;
