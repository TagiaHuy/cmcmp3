import React from 'react';
import {
  ListItem, ListItemAvatar, Avatar, ListItemText,
  IconButton, ListItemSecondaryAction
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link } from 'react-router-dom';

export default function AlbumListItem({
  album,
  index,
  onPlay,      // optional: phát album
  onOpen,      // optional: mở trang chi tiết
}) {
  const imageUrl = album?.imageUrl || '/placeholder-cover.png';
  const subtitle = `${album?.numberOfSongs ?? 0} bài • ${(album?.listenCount ?? 0).toLocaleString()} lượt nghe`;

  return (
    <ListItem
      divider
      secondaryAction={
        <ListItemSecondaryAction>
          {onPlay && (
            <IconButton edge="end" aria-label="play" onClick={() => onPlay(album)}>
              <PlayArrowRoundedIcon />
            </IconButton>
          )}
          {onOpen ? (
            <IconButton edge="end" aria-label="open" onClick={() => onOpen(album)}>
              <ChevronRightRoundedIcon />
            </IconButton>
          ) : (
            <IconButton
              edge="end"
              aria-label="open"
              component={Link}
              to={`/albums/${album.id}`}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      }
    >
      <ListItemAvatar>
        <img
          src={imageUrl}
          alt={album?.name}
          style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }}
          onError={(e) => {
            console.error('Error loading album image:', imageUrl, e);
            e.target.src = '/placeholder-cover.png'; // Fallback to placeholder
          }}
        />
      </ListItemAvatar>

      <ListItemText
        primary={`${index + 1}. ${album?.name ?? 'Album'}`}
        secondary={subtitle}
        primaryTypographyProps={{ fontWeight: 600 }}
      />
    </ListItem>
  );
}
