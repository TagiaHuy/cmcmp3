import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseCard from './BaseCard';
import CardTag from './CardTag';
import PlayableImage from './PlayableImage';

function PlaylistCard({ title, artists, imageUrl, onPlay, mediaSrc }) {
  // Style cho container card
  const cardStyle = {
    // Chiều rộng và chiều cao cố định
    width: 320, 
    height: 130,
    borderRadius: '4px',
    padding: 2,
    display: 'flex',
    alignItems: 'flex-end', // Đẩy nội dung xuống dưới
    position: 'relative',
    overflow: 'hidden', // Quan trọng để giữ hình ảnh trong phạm vi
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%)',

    },
    
    // Tạo hiệu ứng mờ dần (gradient) phủ lên màu nền
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // Hiệu ứng mờ từ dưới lên để làm nổi bật chữ
      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
      zIndex: 1, // Ensure gradient is above blurred background
    },
  };

  return (
    <BaseCard sx={cardStyle}>
        {/* Blurred background image */}
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(8px)',
                zIndex: 0, // Ensure it's behind other content
            }}
        />
        
        {/* Lớp thông báo "CÓ THỂ BẠN THÍCH" */}
        <CardTag text="CÓ THỂ BẠN THÍCH" />

        {/* Khung chứa hình ảnh */}
        <PlayableImage imageUrl={imageUrl} title={title} sx={{ position: 'absolute', top: 15, left: 15, zIndex: 2 }} onPlay={onPlay} mediaSrc={mediaSrc} />
        
        {/* Nội dung chữ */}
        <Box sx={{ marginLeft: '160px', zIndex: 3, paddingBottom: 3, position: 'relative' }}>
            <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                color="white"
                // Điều chỉnh fontSize cho phù hợp
                sx={{ lineHeight: 1.2 }}
            >
                {title}
            </Typography>
            <Typography 
                variant="caption" 
                color="#ccc" 
                mt={0.5}
                sx={{ display: 'block' }}
            >
                {artists}
            </Typography>
        </Box>
    </BaseCard>
  );
}

export default PlaylistCard;