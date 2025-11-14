import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

import useSong from '../hooks/useSong';
import SongDetailCard from '../components/Card/SongDetailCard';
import SongList from '../components/SongList/SongList';
import { useMediaPlayer, normalizeArtists } from '../context/MediaPlayerContext';

const SongDetailPage = () => {
  const { songId } = useParams();
  const { song, loading, error } = useSong(songId);

  // ⭐ lấy hàm điều khiển trình phát
  const { handlePlay, loadQueue } = useMediaPlayer();

  /** 
   * ⭐ Khi load bằng URL (F5 / click từ playlist):
   * FE phải tạo track theo đúng format MediaPlayerContext
   */
  useEffect(() => {
    if (!song) return;

    const track = {
      id: song.id,
      title: song.title,
      imageUrl: song.imageUrl,
      mediaSrc: song.mediaSrc || song.audioUrl,
      artists: normalizeArtists(song.artists),
    };

    // set queue = 1 bài khi vào SongDetail
    loadQueue([track], 0);

  }, [song, loadQueue]);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Lỗi khi tải bài hát.</Typography>;
  }

  if (!song) {
    return <Typography>Không tìm thấy bài hát.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="row" sx={{ p: 3 }}>
      {/* ⭐ Card chi tiết bài hát */}
      <SongDetailCard song={song} />

      <Box sx={{ width: '100%' }}>
        {/* ⭐ Danh sách bài (SongList) */}
        <SongList songIds={[songId]} />
      </Box>
    </Box>
  );
};

export default SongDetailPage;
