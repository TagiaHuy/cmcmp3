import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar,
  ListItemButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate } from 'react-router-dom';

const AlbumListItem = ({ album, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/albums/${album.id}`);
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
      secondaryAction={
        <Box>
          {onEdit && (
            <IconButton aria-label="edit" onClick={(e) => { e.stopPropagation(); onEdit(album); }}>
              <EditIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); onDelete(album.id); }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      }
    >
      <ListItemButton onClick={handleItemClick} sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'transparent' } }}>
        <Avatar variant="rounded" src={album.imageUrl} sx={{ mr: 2, width: 56, height: 56, backgroundColor: 'grey.800' }}>
          <MusicNoteIcon />
        </Avatar>
        <ListItemText
          primary={
            <Typography variant="body1" color="text.primary" fontWeight={600}>
              {album.title}
            </Typography>
          }
          secondary={
            <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography component="span" variant="body2" color="text.primary">
                {`${album.songCount} bài hát`}
              </Typography>
              <Typography component="span" variant="body2" color="text.primary">
                •
              </Typography>
              <Typography component="span" variant="body2" color="text.primary">
                {album.privacy}
              </Typography>
            </Box>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default AlbumListItem;