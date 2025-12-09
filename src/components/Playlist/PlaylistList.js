import React from 'react';
import { List } from '@mui/material';
import PlaylistListItem from './PlaylistListItem';

const PlaylistList = ({ playlists, onEdit, onDelete }) => {
  return (
    <List>
      {playlists.map((playlist) => (
        <PlaylistListItem
          key={playlist.id}
          playlist={playlist}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};

export default PlaylistList;
