import React from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
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
const PlaylistView = ({ playlist, banners }) => {
  const { songs, loading, error } = useSongsByIds(playlist ? playlist.songs : []);
  const { handlePlay } = useMediaPlayer();
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
                <PlaylistCarousel playlists={songs} onPlay={handlePlay} />
                <BannerCarousel banners={banners} />
                <RecentlyPlayed />
              </>
            );
          case 'l2':
            return <RecommendCardContainer recommendations={songs} onPlay={handlePlay} />;
          case 'l3':
            return <Top100Section songs={songs} onPlay={handlePlay} />;
          case 'l4':
            return (
                    <Box sx={{ overflowX: "hidden" }}>
                      <BXHNewReleaseSection />
                    </Box>
            );
          default:
            return <PlaylistCarousel title="Songs" playlists={songs} onPlay={handlePlay} />;
        }
      })()}
    </Box>
  );
};

export default PlaylistView;
