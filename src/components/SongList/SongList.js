import React from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import useSongsByIds from '../../hooks/useSongsByIds';
import { useMediaPlayer, normalizeArtists } from '../../context/MediaPlayerContext';
import SongListItem from './SongListItem';

/* -------------------------------------------------------------------
   ⭐ Renderer — chỉ render UI, không fetch, không dùng hook.
------------------------------------------------------------------- */
const SongListRenderer = ({ songs, onPlay, currentTrack }) => {
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 3 }}
      >
        Danh sách phát này hiện chưa có bài hát nào.
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {songs.map((song, index) => {
        if (!song) return null;

        // ⭐ Chuẩn hóa tên nghệ sĩ
        const artistText = normalizeArtists(song.artists);

        // ⭐ Format track unified
        const unifiedTrack = {
          id: song.id,
          title: song.title,
          mediaSrc: song.mediaSrc || song.audioUrl,
          imageUrl: song.imageUrl || '',
          artists: artistText,
        };

        const isPlaying =
          currentTrack &&
          currentTrack.mediaSrc === unifiedTrack.mediaSrc;

        return (
          <SongListItem
            key={song.id || index}
            song={{ ...song, artists: artistText }}
            index={index}
            onPlay={() => onPlay(unifiedTrack)}
            isPlaying={isPlaying}
          />
        );
      })}
    </List>
  );
};

/* -------------------------------------------------------------------
   ⭐ SongList chính — xử lý fetch hoặc nhận sẵn dữ liệu
------------------------------------------------------------------- */
const SongList = ({ songIds, songs: songsFromProps }) => {
  const { handlePlay, currentTrack } = useMediaPlayer();

  // ⭐ Chỉ fetch khi không có songs được truyền thẳng vào props
  const { songs: fetchedSongs, loading, error } = useSongsByIds(songIds);

  const songsToRender = songsFromProps || fetchedSongs;

  // ⭐ Loading/error CHỈ áp dụng khi fetch
  if (!songsFromProps) {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>
          Không thể tải danh sách bài hát.
        </Typography>
      );
    }
  }

  return (
    <SongListRenderer
      songs={songsToRender}
      onPlay={handlePlay}
      currentTrack={currentTrack}
    />
  );
};

export default SongList;
