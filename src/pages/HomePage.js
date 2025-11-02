import React from 'react';
import { Box, Typography } from '@mui/material';
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';
import song1 from '../assets/slaygirl.jpg';

const dummyPlaylists = [
  {
    title: 'Top Hits 2023',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Chill Vibes',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Workout Mix',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Focus Music',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Road Trip Jams',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Top Hits 2023',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Chill Vibes',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Workout Mix',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Focus Music',
    artists: 'Various Artists',
    imageUrl: song1,
  },
  {
    title: 'Road Trip Jams',
    artists: 'Various Artists',
    imageUrl: song1,
  },
];

const HomePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <PlaylistCarousel title="Recommended Playlists" playlists={dummyPlaylists}/>
    </Box>
  );
};

export default HomePage;