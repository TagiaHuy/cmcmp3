import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useSongsByIds from '../../hooks/useSongsByIds';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PlaylistCard from './PlaylistCard';
import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import BannerCarousel from '../Carousel/BannerCarousel';
import RecentlyPlayed from './RecentlyPlayed';
import { Recommend } from '@mui/icons-material';
import RecommendCardContainer from '../Carousel/RecommendCardContainer';
import Top100Section from './Top100Section';
import BXHNewReleaseSection from './BXHNewReleaseSection';
import SongCarousel from '../Carousel/SongCarousel'; // Import SongCarousel

const PlaylistView = ({ playlist, banners }) => {
  const { songs, loading, error } = useSongsByIds(playlist ? playlist.songs : []);
  const { handlePlay, loadQueue } = useMediaPlayer(); // Import loadQueue

  const handlePlaySongs = (song, index) => {
    loadQueue(songs, index);
  };

  if (!playlist) {
    return null;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching songs in playlist.</Typography>;
  }

  return (
    <Box sx={{ mb: 4 }}>
      {(() => {
        switch (playlist.id) {
          case 'l1':
            return (
              <>
                <SongCarousel songs={songs} onPlay={handlePlaySongs} /> {/* Use SongCarousel */}
                <BannerCarousel banners={banners} />
                <RecentlyPlayed />
              </>
            );
          case 'l2':
            return <RecommendCardContainer recommendations={songs} onPlay={handlePlaySongs} />;
          case 'l3':
            return <Top100Section />; {/* Top100Section manages its own data */}
          case 'l4':
            return (
                    <Box sx={{ overflowX: "hidden" }}>
                      <BXHNewReleaseSection />
                    </Box>
            );
          default:
            return <SongCarousel title="Songs" songs={songs} onPlay={handlePlaySongs} />; {/* Use SongCarousel */}
        }
      })()}
    </Box>
  );
};

export default PlaylistView;
