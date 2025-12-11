import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import usePlaylists from '../hooks/usePlaylists';
import ZingChartSection from '../components/Chart/ZingChartSection';
import TopPlaylistsSection from '../components/Card/TopPlaylistsSection';
import UserAlbums from '../components/Album/UserAlbums'; // Re-import UserAlbums
import TopSongsSection from '../components/Card/TopSongsSection';
import PlaylistView from '../components/Card/PlaylistView';
import Top100Section from '../components/Card/Top100Section';
import BXHNewReleaseSection from '../components/Card/BXHNewReleaseSection';
import RecentlyPlayed from '../components/Card/RecentlyPlayed';
import Footer from '../layout/Footer';
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
      
      <Box sx={{ my: 5, ml: 11, mr: 11 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Album của bạn
        </Typography>
        <UserAlbums isHomepage={true} />
      </Box>
      <RecentlyPlayed />

      <Top100Section />
      <BXHNewReleaseSection />

      <PlaylistView playlist={l1} banners={playlists.map(p => ({ ...p, title: p.name }))} />
      <PlaylistView playlist={l2} />
      <PlaylistView playlist={l3} />
      <PlaylistView playlist={l4} />

      <ZingChartSection />
      <Footer />
    </Box>
  );
};

export default HomePage;
