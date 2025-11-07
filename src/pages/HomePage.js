import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import PlaylistView from '../components/Card/PlaylistView';
import usePlaylists from '../hooks/usePlaylists';
const HomePage = () => {
  const { handlePlay } = useMediaPlayer();
  const { playlists, loading, error } = usePlaylists();
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
      <PlaylistCarousel playlists={songs} onPlay={handlePlay} />
      <RecentlyPlayed />
      <BannerCarousel banners={sampleBanners} />
      <RecommendCardContainer recommendations={dummyRecommendations} onPlay={handlePlay} />
      <Top100Section />
      <Box sx={{ overflowX: "hidden" }}>
        <BXHNewReleaseSection />
      </Box>
    </Box>
  );
};

export default HomePage;