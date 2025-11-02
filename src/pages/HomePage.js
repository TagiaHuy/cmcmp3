import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';
import MediaPlayer from '../components/MediaPlayer/MediaPlayer';
import song1 from '../assets/slaygirl.jpg';

const dummyPlaylists = [
  {
    title: 'Top Hits 2023',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverending_Story.mp3',
  },
  {
    title: 'Chill Vibes',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
  },
  {
    title: 'Workout Mix',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3',
  },
  {
    title: 'Focus Music',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverending_Story.mp3',
  },
  {
    title: 'Road Trip Jams',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
  },
  {
    title: 'Top Hits 2023',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3',
  },
  {
    title: 'Chill Vibes',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverending_Story.mp3',
  },
  {
    title: 'Workout Mix',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3',
  },
  {
    title: 'Focus Music',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3',
  },
  {
    title: 'Road Trip Jams',
    artists: 'Various Artists',
    imageUrl: song1,
    mediaSrc: 'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverending_Story.mp3',
  },
];

const HomePage = () => {
  const [currentPlayingSrc, setCurrentPlayingSrc] = useState(null);
  const [isMediaPlayerVisible, setIsMediaPlayerVisible] = useState(false);

  const handlePlay = (src) => {
    setCurrentPlayingSrc(src);
    setIsMediaPlayerVisible(true);
  };

  return (
    <Box sx={{ p: 3, paddingBottom: isMediaPlayerVisible ? '100px' : '24px' }}>
      <PlaylistCarousel playlists={dummyPlaylists} onPlay={handlePlay} />

      {isMediaPlayerVisible && (
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 1,
        }}>
          <MediaPlayer src={currentPlayingSrc} />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;