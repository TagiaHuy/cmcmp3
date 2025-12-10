import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton } from '@mui/material';
import { PlayArrow, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const PlaylistListItem = ({ playlist, onEdit, onDelete }) => {
  if (!playlist) return null;

  return (
    <ListItem
      component={Link}
      to={`/playlists/${playlist.id}`}
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        borderRadius: '4px',
        p: 1,
      }}
    >
      <ListItemAvatar>
        <Avatar variant="rounded" src={playlist.imageUrl} sx={{ width: 56, height: 56, mr: 2 }}>
          <PlayArrow />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography noWrap variant="h6" sx={{ color: 'text.primary' }}>
            {playlist.title}
          </Typography>
        }
        secondary={
          <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
            {playlist.user?.name || 'Unknown Creator'}
          </Typography>
        }
      />
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        {onEdit && onDelete && (
          <>
            <IconButton onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(playlist); }}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(playlist.id); }}>
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    </ListItem>
  );
};

export default PlaylistListItem;