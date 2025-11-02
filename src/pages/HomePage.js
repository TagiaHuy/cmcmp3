import BannerCarousel from '../components/Carousel/BannerCarousel';
import React, { useEffect } from 'react';  
import { Box, Typography } from '@mui/material'; 
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';  
import Banner from '../components/Card/Banner'; // Import the Banner component
import song1 from '../assets/slaygirl.jpg';  
import banner from '../assets/anh-ech-meme.jpg';  
import sampleMusic from '../assets/Sample.mp3'; // Assuming sample.mp3 is in assets
import { useMediaPlayer } from '../context/MediaPlayerContext';

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
];

const sampleBanners = [
  {
    imageUrl: banner,
  },
  {
    imageUrl: song1,
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
      <BannerCarousel banners={sampleBanners} />
    </Box>
  );
};

export default HomePage;