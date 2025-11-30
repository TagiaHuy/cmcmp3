import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar,
  ListItemButton // Import ListItemButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PlaylistListItem = ({ playlist, onEdit, onDelete }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleItemClick = () => {
    navigate(`/playlists/${playlist.id}`); // Navigate to playlist detail page
  };

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
      secondaryAction={ // Move secondaryAction here to keep icons clickable
        <Box>
          {onEdit && ( // Conditionally render edit button if onEdit prop is provided
            <IconButton aria-label="edit" onClick={(e) => { e.stopPropagation(); onEdit(playlist); }}>
              <EditIcon />
            </IconButton>
          )}
          {onDelete && ( // Conditionally render delete button if onDelete prop is provided
            <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      }
    >
      <ListItemButton onClick={handleItemClick} sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'transparent' } }}> {/* Use ListItemButton for clickability */}
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
      </ListItemButton>
    </ListItem>
  );
};

export default PlaylistListItem;
