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
import PlaylistCard from '../components/Card/PlaylistCard';
import { useParams } from 'react-router-dom';
import useSong from '../hooks/useSong'; // Custom hook to fetch a single song

const TestPage = () => {
  const { handlePlay } = useMediaPlayer();
  const { songId } = useParams(); // Get songId from URL params
  const { song, loading, error } = useSong(songId); // Use the custom hook

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching songs.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
        <h1>Test</h1>
      <PlaylistCard playlist={song} onPlay={handlePlay} />
    </Box>
  );
};

export default TestPage;