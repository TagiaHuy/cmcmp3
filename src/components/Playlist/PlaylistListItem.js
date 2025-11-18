import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const PlaylistListItem = ({ playlist, onEdit, onDelete }) => {
  return (
    <ListItem
      divider
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        borderRadius: '8px',
        mb: 1,
      }}
    >
      <Avatar variant="rounded" src={playlist.imageUrl} sx={{ mr: 2, width: 56, height: 56, backgroundColor: 'grey.800' }}>
        <MusicNoteIcon />
      </Avatar>
      <ListItemText
        primary={
          <Typography variant="body1" color="text.primary" fontWeight={600}>
            {playlist.title}
          </Typography>
        }
        secondary={
          <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography component="span" variant="body2" color="text.primary">
              {`${playlist.songCount} bài hát`}
            </Typography>
            <Typography component="span" variant="body2" color="text.primary">
              •
            </Typography>
            <Typography component="span" variant="body2" color="text.primary">
              {playlist.privacy}
            </Typography>
          </Box>
        }
      />
      <Box>
        <IconButton aria-label="edit" onClick={() => onEdit(playlist)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(playlist.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default PlaylistListItem;
