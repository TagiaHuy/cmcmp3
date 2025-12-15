// src/components/Card/RecommendationSection.js
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useRecommendations from '../../hooks/useRecommendations';
import SongCarousel from '../Carousel/SongCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

const RecommendationSection = () => {
  const { recs, loading, error } = useRecommendations();
  const { handlePlay } = useMediaPlayer();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return null;
  }

  if (!recs || recs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      <SongCarousel
        title="Gợi ý cho bạn"
        songs={recs}
        onPlay={handlePlay}
        columns={5}
      />
    </Box>
  );
};

export default RecommendationSection;
