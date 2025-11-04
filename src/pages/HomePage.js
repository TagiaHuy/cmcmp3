import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import BannerCarousel from '../components/Carousel/BannerCarousel';
import RecommendCardContainer from '../components/Carousel/RecommendCardContainer';
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';
import RecentlyPlayed from '../components/Card/RecentlyPlayed';
import Top100Section from "../components/Card/Top100Section";
import { useMediaPlayer } from '../context/MediaPlayerContext';
import useSongs from '../hooks/useSongs'; // Import the custom hook
import song1 from '../assets/slaygirl.jpg';  
import banner from '../assets/anh-ech-meme.jpg';  
import sampleMusic from '../assets/Yas.mp3'; // Assuming sample.mp3 is in assets

const sampleBanners = [
  {
    imageUrl: banner,
  },
  {
    imageUrl: song1,
  },
];

const dummyRecommendations = [
  {
    title: 'Daily Mix 2',
    subtitle: 'John Doe, Jane Doe',
    imageSrc: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Discover Weekly 2',
    subtitle: 'Various Artists',
    imageSrc: banner,
    mediaSrc: sampleMusic,
  },
    {
    title: 'Daily Mix 2',
    subtitle: 'John Doe, Jane Doe',
    imageSrc: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Discover Weekly 2',
    subtitle: 'Various Artists',
    imageSrc: banner,
    mediaSrc: sampleMusic,
  },
    {
    title: 'Daily Mix 2',
    subtitle: 'John Doe, Jane Doe',
    imageSrc: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Discover Weekly 2',
    subtitle: 'Various Artists',
    imageSrc: banner,
    mediaSrc: sampleMusic,
  },
    {
    title: 'Daily Mix 2',
    subtitle: 'John Doe, Jane Doe',
    imageSrc: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Discover Weekly 2',
    subtitle: 'Various Artists',
    imageSrc: banner,
    mediaSrc: sampleMusic,
  },
    {
    title: 'Daily Mix 2',
    subtitle: 'John Doe, Jane Doe',
    imageSrc: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Discover Weekly 2',
    subtitle: 'Various Artists',
    imageSrc: banner,
    mediaSrc: sampleMusic,
  },
];

const HomePage = () => {
  const { handlePlay } = useMediaPlayer();
  const { songs, loading, error } = useSongs(); // Use the custom hook

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
    </Box>
  );
};

export default HomePage;
