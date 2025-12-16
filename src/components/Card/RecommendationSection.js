
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import useRecommendations from '../../hooks/useRecommendations';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import SongSuggestionCard from './SongSuggestionCard';

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

  if (error || !recs || recs.length === 0) {
    return null;
  }

  // Lấy đúng 9 bài cho layout 3×3
  const items = recs.slice(0, 9);

  return (
    <Box sx={{ my: 4, ml: 11, mr: 11 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          color: (theme) => theme.palette.text.primary,
          mb: 2,
          fontWeight: 700
        }}
      >
        Gợi ý cho bạn
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          // Luôn 3 cột từ md trở lên; nhỏ hơn thì linh hoạt cho mobile
          gridTemplateColumns: {
            xs: '1fr',            // 1 cột trên điện thoại nhỏ
            sm: 'repeat(2, 1fr)', // 2 cột trên tablet nhỏ
            md: 'repeat(3, 1fr)'  // 3 cột trên desktop/tablet lớn
          },
          // (tuỳ chọn) đặt chiều cao tối thiểu để các thẻ đều nhau
          '& > .suggestion-item': {
            minHeight: 88 // vừa cho kiểu thẻ ngang với cover 60–64px
          }
        }}
      >
        {items.map((song) => (
          <Box key={song.id} className="suggestion-item">
            <SongSuggestionCard song={song} onPlay={handlePlay} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecommendationSection;
