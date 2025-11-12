import React from 'react';
import { List, Typography } from '@mui/material';
import ArtistListItem from './ArtistListItem';

const ArtistList = ({ artists }) => {
  if (!artists || artists.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
        Không có nghệ sĩ nào để hiển thị.
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {artists.map((artist, index) => (
        <ArtistListItem
          key={artist.id}
          artist={artist}
          index={index}
        />
      ))}
    </List>
  );
};

export default ArtistList;
