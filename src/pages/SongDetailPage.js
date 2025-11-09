import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import useSong from '../hooks/useSong';
import SongDetailCard from '../components/Card/SongDetailCard';
import SongList from '../components/SongList/SongList';

const SongDetailPage = () => {
  const { songId } = useParams();
  const { song, loading, error } = useSong(songId);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error fetching song details.</Typography>;
  }

  if (!song) {
    return <Typography>Song not found.</Typography>;
  }

  return (
    <Box display={'flex'} flexDirection="row" sx={{ p: 3 }}>
      <SongDetailCard song={song} />
      <Box sx={{width: '100%'}}>
        <SongList songIds={[songId]} />
      </Box>
    </Box>
  );
};

export default SongDetailPage;
