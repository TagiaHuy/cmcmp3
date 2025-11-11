import React from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import useSongsByIds from '../../hooks/useSongsByIds';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import SongListItem from './SongListItem';

// This is a new "presentational" component that just renders the list of songs.
const SongListRenderer = ({ songs, onPlay, currentTrack }) => {
  if (!songs || songs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
        Danh sách phát này hiện chưa có bài hát nào.
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {songs.map((song, index) => (
        <SongListItem
          key={song.id}
          song={song}
          index={index}
          onPlay={() => onPlay(song)}
          isPlaying={currentTrack && currentTrack.id === song.id}
        />
      ))}
    </List>
  );
};

// This is the main component that decides whether to fetch songs or use the ones passed in.
const SongList = ({ songIds, songs: songsFromProps }) => {
  const { handlePlay, loadQueue, currentTrack } = useMediaPlayer(); // Import loadQueue
  
  // Always call hooks at the top level.
  const { songs: fetchedSongs, loading, error } = useSongsByIds(songIds);

  // If songs are passed directly, we use them. Otherwise, we use the fetched ones.
  const songsToRender = songsFromProps || fetchedSongs;

  // Loading and error states are only relevant if we are fetching data.
  if (!songsFromProps) {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>Không thể tải danh sách bài hát.</Typography>;
    }
  }

  const handlePlaySongList = (song, index) => {
    loadQueue(songsToRender, index); // Load entire list and start from clicked song
  };

  return <SongListRenderer songs={songsToRender} onPlay={handlePlaySongList} currentTrack={currentTrack} />;
};

export default SongList;