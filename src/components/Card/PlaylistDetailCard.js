import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'; // Icon Lượt Nghe
import FavoriteIcon from '@mui/icons-material/Favorite'; // Icon Lượt Thích
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Icon Số Bài hát
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import PlayallButton from '../Button/Specific/PlayallButton'; // Thường là nút nổi bật

const PlaylistDetailCard = ({ playlist }) => {
  // Giả định thêm trường 'creator' hoặc 'author' vào object playlist
  const creatorName = playlist.creator || "Người dùng"; // Mặc định nếu không có

  return (
    <Box 
      sx={{ 
        p: { xs: 3, md: 6 }, 
        maxWidth: 1000, // Giới hạn chiều rộng cho desktop
        mx: 'auto', // Căn giữa
        // Thiết lập nền nhẹ nếu cần, hoặc để nền mặc định của trang
      }}
    >
      {/* --- PHẦN HEADER: Ảnh và Thông tin chính (Flex cho Desktop) --- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Dọc trên mobile, Ngang trên desktop
          alignItems: { xs: 'center', md: 'flex-start' }, // Căn chỉnh dưới cùng trên desktop
          textAlign: { xs: 'center', md: 'left' }, // Căn giữa trên mobile, trái trên desktop
          mb: 4,
          gap: { xs: 3, md: 4 }, // Khoảng cách giữa ảnh và nội dung
        }}
      >
        {/* 1. Ảnh Playlist */}
        <Box
          component="img"
          sx={{
            width: { xs: 200, md: 300 },
            // height: { xs: 200, md: 300 },
            objectFit: 'cover',
            borderRadius: 3, // Bo góc mềm mại
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)', // Đổ bóng nổi bật
            flexShrink: 0, // Đảm bảo ảnh không bị co lại
          }}
          src={playlist.imageUrl}
          alt={playlist.name}
        />

        {/* 2. Nội dung Playlist */}
        <Stack> {/* Padding bottom để căn chỉnh với ảnh */}
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            Playlist
          </Typography>

          {/* Tiêu đề (Nổi bật nhất) */}
          <Typography 
            variant="h2" // Cỡ chữ lớn cho tiêu đề
            component="h1" 
            color="text.primary" 
            fontWeight={800} // Cực kỳ đậm
          >
            {playlist.name}
          </Typography>

          {/* Mô tả */}
          {playlist.description && (
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              {playlist.description}
            </Typography>
          )}

          {/* Thông tin Người tạo và Ngày tạo */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {creatorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {playlist.createdAt}
            </Typography>
          </Stack>

          {/* Thống kê (Lượt Nghe | Lượt Thích | Số Bài hát) */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 1 }}>
            
            {/* Lượt Nghe */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <HeadsetMicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {playlist.listenCount}
              </Typography>
            </Stack>

            {/* Lượt Thích */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
              <Typography variant="body2" color="text.secondary">
                {playlist.likeCount}
              </Typography>
            </Stack>
            
            {/* Số Bài hát */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <MusicNoteIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {playlist.numberOfSongs} bài hát
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} /> {/* Đường phân cách */}

      {/* --- PHẦN ACTION BUTTONS --- */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        width: '100%', 
        justifyContent: { xs: 'center', md: 'flex-start' } // Căn trái trên desktop
      }}>
        {/* Nút Play Nổi bật (Ví dụ: Nút tròn lớn, màu sắc rực rỡ) */}
        <PlayallButton sx={{ width: 64, height: 64, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }} />
        
        {/* Các nút phụ (Kích thước tiêu chuẩn) */}
        <FavoriteButton />
        <MoreButton />
      </Box>
      
      {/* --- Vị trí này là nơi bạn đặt component danh sách bài hát (Song List) --- 
      */}
      
    </Box>
  );
};

export default PlaylistDetailCard;