import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreButton from '../Button/Specific/MoreButton'; // Giả sử MoreButton đã ổn
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PrimaryPlaybackButton from '../Button/Specific/PrimaryPlaybackButton';
import FavoriteButton from '../Button/Specific/FavoriteButton';


const SongDetailCard = ({ song }) => {
  const { handlePlay, currentTrack } = useMediaPlayer();
  const isPlaying = currentTrack && currentTrack.title === song.title;

  // Giả sử có trạng thái thích/không thích
  const isLiked = song.isFavorite || false; // Thêm prop isFavorite vào song object

  console.log('SongDetailCard song prop:', song);

  return (
    <Box 
      sx={{ 
        p: { xs: 3, md: 5 }, // Tăng padding tổng thể
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        maxWidth: 450, // Tăng nhẹ chiều rộng tối đa
        mx: 'auto', 
      }}
    >
      {/* 1. Hình ảnh Album nổi bật */}
      <Box
        component="img"
        sx={{
          width: { xs: 250, md: 350 }, // Ảnh lớn hơn trên desktop
          height: { xs: 250, md: 350 },
          objectFit: 'cover',
          borderRadius: 4, // Bo góc mạnh mẽ hơn
          mb: 4, 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)', // Đổ bóng hiện đại
          transition: 'transform 0.3s ease-in-out', // Hiệu ứng hover nhẹ
          '&:hover': {
            transform: 'scale(1.02)',
          }
        }}
        src={song.imageUrl}
        alt={song.title}
      />

      {/* 2. Nhóm Tiêu đề & Nghệ sĩ */}
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        {/* Tiêu đề Bài hát */}
        <Typography 
          variant="h3" 
          component="h1" 
          color="text.primary" 
          fontWeight={800} // Cực kỳ nổi bật
        >
          {song.title}
        </Typography>

        {/* Nghệ sĩ */}
        <Typography 
          variant="h5" 
          component="h2" 
          color="text.secondary" 
          fontWeight={600} // Đậm hơn một chút để dễ đọc
          sx={{ opacity: 0.8 }}
        >
          {song.artists}     
        </Typography>
      </Stack>

      {/* 3. Nhóm Nút điều khiển hành động chính */}
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
        {/* Nút Like (Sử dụng IconButton trực tiếp nếu FavoriteButton chỉ là một nút đơn) */}
        <FavoriteButton isFavorite={isLiked} />
        
        {/* Nút Play/Pause chính */}
        <PrimaryPlaybackButton isPlaying={isPlaying} handlePlayPause={() => handlePlay(song)} />
        
        {/* Nút More */}
        <MoreButton />
      </Stack>
      
      {/* 4. Lượt Nghe và Lượt Thích (Thông tin thống kê nhỏ gọn) */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        {/* Lượt Nghe */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <HeadsetMicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {song.listenCount}
          </Typography>
        </Stack>

        {/* Lượt Thích */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <FavoriteBorderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {song.likeCount}
          </Typography>
        </Stack>
      </Stack>

      {/* 5. Thông tin bổ sung */}
      {song.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, px: 2, maxWidth: '100%' }}>
          {song.description}
        </Typography>
      )}
      <Typography variant="caption" color="text.disabled" sx={{ mb: 1 }}>
        {song.label} | Phát hành: {song.createdAt}
      </Typography>
      
    </Box>
  );
};

export default SongDetailCard;