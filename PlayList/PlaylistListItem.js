import React from 'react';
import {
  ListItem, ListItemAvatar, Avatar, ListItemText,
  IconButton, ListItemSecondaryAction
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link } from 'react-router-dom';

export default function PlaylistListItem({
  playlist,
  index,
  onPlay,      // optional: phát playlist
  onOpen,      // optional: mở trang chi tiết
}) {
  const imageUrl = playlist?.imageUrl || '/placeholder-cover.png';
  const subtitle = `${playlist?.numberOfSongs ?? 0} bài • ${(playlist?.listenCount ?? 0).toLocaleString()} lượt nghe`;

  return (
    <ListItem
      divider
      secondaryAction={
        <ListItemSecondaryAction>
          {onPlay && (
            <IconButton edge="end" aria-label="play" onClick={() => onPlay(playlist)}>
              <PlayArrowRoundedIcon />
            </IconButton>
          )}
          {onOpen ? (
            <IconButton edge="end" aria-label="open" onClick={() => onOpen(playlist)}>
              <ChevronRightRoundedIcon />
            </IconButton>
          ) : (
            <IconButton
              edge="end"
              aria-label="open"
              component={Link}
              to={`/playlists/${playlist.id}`}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      }
    >
      <ListItemAvatar>
        <Avatar
          variant="square"
          src={imageUrl}
          alt={playlist?.name}
          sx={{ width: 56, height: 56, borderRadius: 1 }}
        />
      </ListItemAvatar>

      <ListItemText
        primary={`${index + 1}. ${playlist?.name ?? 'Playlist'}`}
        secondary={subtitle}
        primaryTypographyProps={{ fontWeight: 600 }}
      />
    </ListItem>
  );
}
