import React from 'react';
import {
  ListItem, ListItemAvatar, Avatar, ListItemText,
  IconButton, ListItemSecondaryAction, Box
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link } from 'react-router-dom';

export default function PlaylistListItem({
  playlist,
  index,
  onPlay,
  onOpen,
  onEdit,
  onDelete,
}) {
  const imageUrl = playlist?.imageUrl || '/placeholder-cover.png';
  const subtitle = `${playlist?.songs?.length ?? 0} bài hát • ${(playlist?.listenCount ?? 0).toLocaleString()} lượt nghe`;

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent ListItem click event
    onEdit(playlist);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent ListItem click event
    onDelete(playlist.id);
  };

  return (
    <ListItem
      divider
      button
      component={Link}
      to={`/playlist/${playlist.id}`} // Link to detail page
    >
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          src={imageUrl}
          alt={playlist?.title}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
      </ListItemAvatar>

      <ListItemText
        primary={playlist?.title ?? 'Playlist'}
        secondary={subtitle}
        primaryTypographyProps={{ fontWeight: 500, noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
      />
      
      <ListItemSecondaryAction>
        {onEdit && (
          <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
        {onPlay && (
          <IconButton edge="end" aria-label="play" onClick={() => onPlay(playlist)}>
            <PlayArrowRoundedIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
