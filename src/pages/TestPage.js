import React, { use } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import BannerCarousel from '../components/Carousel/BannerCarousel';
import RecommendCardContainer from '../components/Carousel/RecommendCardContainer';
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';
import RecentlyPlayed from '../components/Card/RecentlyPlayed';
import Top100Section from "../components/Card/Top100Section";
import { useMediaPlayer } from '../context/MediaPlayerContext';
import useSongs from '../hooks/useSongs'; // Import the custom hook
import BXHNewReleaseSection from '../components/Card/BXHNewReleaseSection';
import useSong from '../hooks/useSong';
import usePlaylists from '../hooks/usePlaylists';
import PlaylistView from '../components/Card/PlaylistView';

const TestPage = () => {
  const { handlePlay } = useMediaPlayer();

  const songId = 's1'; // Example song ID
  const { song, loading: songLoading, error: songError } = useSong(songId);
  const { playlists } = usePlaylists();
  const l1 = playlists.find(p => p.id === 'l1');
  const l2 = playlists.find(p => p.id === 'l2');
  const l3 = playlists.find(p => p.id === 'l3');
  const l4 = playlists.find(p => p.id === 'l4');
  const l5 = playlists.find(p => p.id === 'l5');
  console.log('TestPage playlists:', playlists);
  console.log('TestPage l1 songs:', l1);
  return (
    <Box sx={{ p: 3 }}>
    <PlaylistView playlist={l1} banners={playlists.map(p => ({ ...p, title: p.name }))} />
    <PlaylistView playlist={l2} />
    <playlistView playlist={l3} />
    <PlaylistView playlist={l4} />
    </Box>
  );
};

export default TestPage;