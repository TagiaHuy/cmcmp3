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
import BXHNewReleaseSection from '../components/Card/BXHNewReleaseSection';
import Amthambenem from '../assets/Am-tham-ben-em.mp3';

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

const dataBXH = [
  {
    id: 1,
    title: "Người Đầu Tiên",
    artists: "Juky San, buitruonglinh",
    order: 1,
    releaseDate: "30.10.2025",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/6/8/c/9/68c95397051202625f2a0d5be7b4c009.jpg",
    mediaSrc: Amthambenem,
  },
  {
    id: 2,
    title: "Canh Bạc Hôn Nhân",
    artists: "LaLa Trần, Nguyễn Hồng Thuận",
    order: 2,
    releaseDate: "28.10.2025",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/1/f/0/0/1f0077a89edf602fad7d253344c3c5f6.jpg",
    mediaSrc: Amthambenem,
  },
  {
    id: 3,
    title: "Thiệp Hồng Sai Tên",
    artists: "Nguyễn Thành Đạt",
    order: 3,
    releaseDate: "30.10.2025",
    cover:"https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/c/b/e/2/cbe2ceec5abeb23993f991d9d2e555fc.jpg",
    mediaSrc: Amthambenem,
  },
  {
    id: 4,
    title: "Hơn Là Bạn",
    artists: "Karik, MIN, Ngô Kiến Huy",
    order: 4,
    releaseDate: "03.11.2025",
    cover:
      "https://tse3.mm.bing.net/th/id/OIF.0WNA7FOhR0ASLTW8Qjw3iQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    mediaSrc: Amthambenem,
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
      <Box sx={{ overflowX: "hidden" }}>
        <BXHNewReleaseSection />
      </Box>
    </Box>
  );
};

export default HomePage;