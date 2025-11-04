import BannerCarousel from '../components/Carousel/BannerCarousel';
import React, { useEffect, useState } from 'react';  
import RecommendCardContainer from '../components/Carousel/RecommendCardContainer';
import song1 from '../assets/slaygirl.jpg';  
import banner from '../assets/anh-ech-meme.jpg';  
import sampleMusic from '../assets/Yas.mp3'; // Assuming sample.mp3 is in assets
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { Box } from '@mui/material';             
import PlaylistCarousel from '../components/Carousel/PlaylistCarousel';                           
import RecentlyPlayed from '../components/Card/RecentlyPlayed';
import Top100Section from "../components/Card/Top100Section";
import { getAllSongs } from '../services/songService'; // Import the song service


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
  const [songs, setSongs] = useState([]); // State to store fetched songs

  useEffect(() => {
    console.log('HomePage: received handlePlay from context', handlePlay);
    const fetchSongs = async () => {
      const fetchedSongs = await getAllSongs();
      // Map fetched songs to the format expected by PlaylistCarousel
      const formattedSongs = fetchedSongs.map(song => ({
        title: song.title,
        artists: song.artist, // Assuming 'artist' from API maps to 'artists' in component
        imageUrl: song1, // Placeholder image, replace with actual image from API if available
        mediaSrc: `http://localhost:8080/api/songs/stream/${song.id}`  , // Construct stream URL
      }));
      setSongs(formattedSongs);
    };

    fetchSongs();
  }, [handlePlay]);

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
