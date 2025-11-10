import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import usePlaylist from '../hooks/usePlaylist';
import SongList from '../components/SongList/SongList';
import PlaylistDetailCard from '../components/Card/PlaylistDetailCard';

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const { playlist, loading, error } = usePlaylist(playlistId);
  console.log(playlist);
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !playlist) {
    return <Typography color="error">Error fetching playlist or playlist not found.</Typography>;
  }

  return (
    <Box display={'flex'} flexDirection="row" sx={{ p: 3, width: '100%'}}>
      <PlaylistDetailCard playlist={playlist} />
      <Box sx={{width: '100%'}}>
        <SongList songIds={playlist.songs} />
      </Box>
    </Box>
  );
};

export default PlaylistDetailPage;

