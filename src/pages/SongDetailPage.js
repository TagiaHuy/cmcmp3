import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

import useSong from '../hooks/useSong';
import SongDetailCard from '../components/Card/SongDetailCard';
import SongList from '../components/SongList/SongList';
import { useMediaPlayer, normalizeArtists } from '../context/MediaPlayerContext';
import Comment from '../components/Comment/Comment'; // Import the Comment component

const SongDetailPage = () => {
  const { songId } = useParams();
  const { song, loading, error } = useSong(songId);
  const [displaySong, setDisplaySong] = useState(song);
  const listenCountUpdated = useRef(false);

  // Update displaySong when the song from the hook changes
  useEffect(() => {
    setDisplaySong(song);
    listenCountUpdated.current = false; // Reset when song changes
  }, [song]);

  // ⭐ lấy hàm điều khiển trình phát
  const { loadQueue } = useMediaPlayer();

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
      mediaSrc: song.filePath,
      artists: normalizeArtists(song.artists),
      lyrics: song.lyrics,
    };

    // set queue = 1 bài khi vào SongDetail
    loadQueue([track], 0);

  }, [song, loadQueue]);

  // Real-time listen count update
  useEffect(() => {
    if (!songId || loading) return;

    const listenSessionKey = `cmcmp3-listen-session-${songId}`;
    const interval = setInterval(() => {
      const sessionJSON = localStorage.getItem(listenSessionKey);
      if (sessionJSON) {
        const session = JSON.parse(sessionJSON);
        if (session.counted && !listenCountUpdated.current) {
          setDisplaySong(prevSong => {
            if (prevSong) {
              return { ...prevSong, listenCount: prevSong.listenCount + 1 };
            }
            return prevSong;
          });
          listenCountUpdated.current = true;
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [songId, loading]);

  const handleLikeToggle = (isFavorited) => {
    setDisplaySong(prevSong => {
      if (prevSong) {
        return {
         ...prevSong,
          likeCount: isFavorited? prevSong.likeCount + 1 : prevSong.likeCount - 1,
        };
      }
      return prevSong;
    });
  };


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

  if (!displaySong) {
    return <Typography>Không tìm thấy bài hát.</Typography>;
  }

  return (
    <Box>
      <Box display="flex" flexDirection="row" sx={{ p: 3 }}>
        {/* ⭐ Card chi tiết bài hát */}
        <SongDetailCard song={displaySong} onLikeToggle={handleLikeToggle} />

        <Box sx={{ width: '100%', ml: 3 }}>
          {/* ⭐ Danh sách bài (SongList) */}
          <SongList songIds={[songId]} />
          {/* ⭐ Comment Section */}
          <Comment songId={songId} /> 
        </Box>
      </Box>
    </Box>
  );
};

export default SongDetailPage;
