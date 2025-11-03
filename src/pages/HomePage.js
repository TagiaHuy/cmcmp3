import BannerCarousel from '../components/Carousel/BannerCarousel';
import React, { useEffect } from 'react';  
import RecommendCardContainer from '../components/Card/RecommendCardContainer';
import song1 from '../assets/slaygirl.jpg';  
import banner from '../assets/anh-ech-meme.jpg';  
import sampleMusic from '../assets/Sample.mp3'; // Assuming sample.mp3 is in assets
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { Box } from '@mui/material';             
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';                           
import RecentlyPlayed from '../components/Card/RecentlyPlayed';

const dummyPlaylists = [
  {
    title: 'Top Hits 2023',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Chill Vibes',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Workout Mix',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
    
  },
  {
    title: 'Focus Music',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Road Trip Jams',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Top Hits 2025',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Chill Vibes',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Workout Mix',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Focus Music',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
  {
    title: 'Road Trip Jams',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },

    {
    title: 'Đỉnh cao trending',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: sampleMusic,
  },
];

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

  useEffect(() => {
    console.log('HomePage: received handlePlay from context', handlePlay);
  }, [handlePlay]);

  return (
    <Box sx={{ p: 3 }}>
      <PlaylistCarousel playlists={dummyPlaylists} onPlay={handlePlay} />
      <RecentlyPlayed />
      <BannerCarousel banners={sampleBanners} />
      <RecommendCardContainer recommendations={dummyRecommendations} onPlay={handlePlay} />
    </Box>
  );
};

export default HomePage;
