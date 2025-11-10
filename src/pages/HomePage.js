import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import PlaylistView from '../components/Card/PlaylistView';
import usePlaylists from '../hooks/usePlaylists';
import ZingChartSection from '../components/Chart/ZingChartSection';

// ✅ THÊM MỚI
import { getTopPlaylists } from '../services/playlistService';
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';

const HomePage = () => {
  const { handlePlay } = useMediaPlayer();
  const { playlists, loading, error } = usePlaylists();

  // ✅ THÊM MỚI: state để chứa top playlist
  const [topPlaylists, setTopPlaylists] = useState([]);

  // ✅ THÊM MỚI: load top playlist từ API
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const data = await getTopPlaylists(8, ac.signal);
        setTopPlaylists(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          // This is expected on unmount in strict mode, do nothing.
          return;
        }
        // Handle other errors if needed
        console.error("Failed to fetch top playlists", err);
      }
    })();
    return () => ac.abort();
  }, []);

  const l1 = playlists.find(p => p.id === 'l1');
  const l2 = playlists.find(p => p.id === 'l2');
  const l3 = playlists.find(p => p.id === 'l3');
  const l4 = playlists.find(p => p.id === 'l4');

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching songs.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>

      {/* ✅ THÊM MỚI: SLIDE PLAYLIST NGHE NHIỀU */}
      {topPlaylists.length > 0 && (
        <PlaylistCarousel
          title="Playlist nghe nhiều"
          playlists={topPlaylists}
          onPlay={handlePlay}
        />
      )}

      <PlaylistView playlist={l1} banners={playlists.map(p => ({ ...p, title: p.name }))} />
      <PlaylistView playlist={l2} />
      <PlaylistView playlist={l3} />
      <PlaylistView playlist={l4} />

      <ZingChartSection />
    </Box>
  );
};

export default HomePage;
