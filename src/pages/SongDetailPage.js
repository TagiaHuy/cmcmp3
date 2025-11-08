import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import useSong from '../hooks/useSong';
import SongDetailCard from '../components/Card/SongDetailCard';

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

  return <SongDetailCard song={song} />;
};

export default SongDetailPage;
