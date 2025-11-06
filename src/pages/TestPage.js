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
import PlaylistView from '../components/Card/PlaylistView';
import { useParams } from 'react-router-dom';
import useSong from '../hooks/useSong';
import usePlaylists from '../hooks/usePlaylists';
import PlaylistCard from '../components/Card/PlaylistCard';

const TestPage = () => {
  const { handlePlay } = useMediaPlayer();
  const { songId } = useParams();
  const { song, loading: songLoading, error: songError } = useSong(songId);
  const { playlists, loading: playlistsLoading, error: playlistsError } = usePlaylists();

  return (
    <Box sx={{ p: 3 }}>
      <h1>Test Page</h1>

      <hr />

    
      <hr />

      <h2>Public Playlists</h2>
      {playlistsLoading && <CircularProgress />}
      {playlistsError && <Typography color="error">Error fetching playlists: {playlistsError.message}</Typography>}
      {playlists.map((playlist) => (
        <PlaylistView key={playlist.id} playlist={playlist} />
      ))}
    </Box>
  );
};

export default TestPage;