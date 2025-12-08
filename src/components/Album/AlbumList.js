import React from 'react';
import { List } from '@mui/material';
import AlbumListItem from './AlbumListItem';

const AlbumList = ({ albums, onEdit, onDelete }) => {
  return (
    <List>
      {albums.map((album) => (
        <AlbumListItem
          key={album.id}
          album={album}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};

export default AlbumList;