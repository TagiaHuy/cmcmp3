import React from 'react';
import { List, Typography } from '@mui/material';
import AlbumListItem from './AlbumListItem';

const AlbumList = ({ albums, renderActions }) => {
  if (!Array.isArray(albums) || albums.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 3 }}
      >
        Bạn chưa có album nào.
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {albums.map((album, index) => {
        if (!album) return null;

        return (
          <AlbumListItem
            key={album.id || index}
            album={album}
            renderActions={renderActions}
          />
        );
      })}
    </List>
  );
};

export default AlbumList;