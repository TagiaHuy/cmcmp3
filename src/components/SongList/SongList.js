import React from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import useSongsByIds from '../../hooks/useSongsByIds';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
// Import component mới
import SongListItem from './SongListItem'; 

const SongList = ({ songIds }) => {
  const { songs, loading, error } = useSongsByIds(songIds);
  const { handlePlay, currentTrack } = useMediaPlayer(); // Cần cả currentTrack để highlight

  if (loading) {
    // Căn giữa biểu tượng tải
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>Không thể tải danh sách bài hát.</Typography>;
  }
  
  // Hiển thị danh sách
  return (
    <List sx={{ width: '100%', p: 0 }}>
      {songs.map((song, index) => (
        <SongListItem 
          key={song.id} 
          song={song} 
          index={index}
          onPlay={() => handlePlay(song)} 
          isPlaying={currentTrack && currentTrack.id === song.id}
        />
      ))}
      {songs.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Danh sách phát này hiện chưa có bài hát nào.
          </Typography>
        )}
    </List>
  );
};

export default SongList;