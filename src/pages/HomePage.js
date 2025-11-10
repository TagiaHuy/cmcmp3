import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import usePlaylists from '../hooks/usePlaylists';
import ZingChartSection from '../components/Chart/ZingChartSection';
import TopPlaylistsSection from '../components/Card/TopPlaylistsSection';
import TopSongsSection from '../components/Card/TopSongsSection';
import PlaylistView from '../components/Card/PlaylistView';

const HomePage = () => {
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

      <TopPlaylistsSection />

      <TopSongsSection />

      <PlaylistView playlist={l1} banners={playlists.map(p => ({ ...p, title: p.name }))} />
      <PlaylistView playlist={l2} />
      <PlaylistView playlist={l3} />
      <PlaylistView playlist={l4} />

      <ZingChartSection />
    </Box>
  );
};

export default HomePage;
