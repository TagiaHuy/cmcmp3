import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { getTopPlaylists } from '../../services/playlistService';
import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

export default function TopPlaylistsSection() {
  const [topPlaylists, setTopPlaylists] = useState([]);
  const { handlePlay } = useMediaPlayer();
  const theme = useTheme();
  const headerColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const linkColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const data = await getTopPlaylists(9, ac.signal);
        setTopPlaylists(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        console.error("Failed to fetch top playlists", err);
      }
    })();
    return () => ac.abort();
  }, []);

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: headerColor }}>
          Playlist nghe nhiều
        </Typography>
        <Link to="/playlists" style={{ textDecoration: 'none', fontSize: '0.9rem', opacity: 0.85, color: linkColor }}>
          TẤT CẢ
        </Link>
      </Box>
      {topPlaylists.length > 0 && (
        <PlaylistCarousel
          playlists={topPlaylists}
          onPlay={handlePlay}
          columns={3}
        />
      )}
    </Box>
  );
}
