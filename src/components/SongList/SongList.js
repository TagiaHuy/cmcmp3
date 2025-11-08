import React from 'react';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import useSongsByIds from '../../hooks/useSongsByIds';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PlaylistCard from '../Card/PlaylistCard';
const SongList = ({ songIds }) => {
  const { songs, loading, error } = useSongsByIds(songIds);
  const { handlePlay } = useMediaPlayer();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching songs.</Typography>;
  }

  return (
    <List>
      {songs.map((song) => (
        <ListItem key={song.id} button onClick={() => handlePlay(song)}>
          <PlaylistCard sx={{width: 900}} id={song.id} mediaSrc={song.mediaSrc} imageUrl={song.imageUrl} title={song.title} subtitle={song.artists} onPlay={handlePlay} />
        </ListItem>
      ))}
    </List>
  );
};

export default SongList;
