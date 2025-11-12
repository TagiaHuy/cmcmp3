import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getFavoriteSongs } from '../../services/userService';
import SongList from '../SongList/SongList';

const FavoriteSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const favoriteSongs = await getFavoriteSongs(ac.signal);
        setSongs(favoriteSongs || []);
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setError('Không thể tải danh sách bài hát yêu thích.');
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();

    return () => ac.abort();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>{error}</Typography>;
  }
  
  if (songs.length === 0) {
    return <Typography sx={{ textAlign: 'center', py: 5 }} color="text.primary">Bạn chưa có bài hát yêu thích nào.</Typography>;
  }

  return <SongList songs={songs} />;
};

export default FavoriteSongs;
