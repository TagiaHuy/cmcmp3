import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseCard from './BaseCard';
import CardTag from './CardTag';
import PlayableImage from './PlayableImage';

// ✅ Fallback nền blur (data URI, không gọi mạng → hết nháy)
const FALLBACK_BG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='130'>
       <defs><linearGradient id='g' x1='0' y1='1' x2='0' y2='0'>
         <stop offset='0' stop-color='#171821'/>
         <stop offset='1' stop-color='#1e2130'/>
       </linearGradient></defs>
       <rect width='100%' height='100%' fill='url(#g)'/>
     </svg>`
  );

function PlaylistCardSafe({ playlist, onPlay, variant = 'default' }) {

  const {
    title = playlist?.name || playlist?.title || 'Playlist',
    // ✅ LẤY TÊN CA SĨ
    artist = playlist?.artist || playlist?.creatorDisplayName || 'Không rõ nghệ sĩ',
    imageUrl = playlist?.imageUrl || '',
    mediaSrc = playlist?.mediaSrc,
  } = playlist || {};

  // ✅ Dùng ảnh an toàn cho nền blur (tránh retry URL lỗi gây nháy)
  const safeBg = imageUrl || FALLBACK_BG;

  const cardStyle = {
    width: 320,
    height: 130,
    borderRadius: '4px',
    padding: 2,
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    backgroundColor: variant === 'simple' ? (theme) => theme.palette.action.hover : 'transparent',

    '&:hover': {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
      background: variant === 'simple'
        ? (theme) => theme.palette.action.selected
        : 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)',
      zIndex: 1,
      display: variant === 'simple' ? 'none' : 'block',
    },
  };

  return (
    <BaseCard sx={cardStyle}>
      {variant === 'default' && (
        <>
          {/* ✅ Nền blur dùng safeBg để không bị retry URL lỗi */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${safeBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(8px)',
              transform: 'scale(1.02)',          // tránh viền blur
              willChange: 'filter, transform',
              zIndex: 0,
            }}
          />
          <CardTag text="CÓ THỂ BẠN THÍCH" />
        </>
      )}

      {/* Ảnh phát (đã có fallback trong PlayableImage) */}
      <PlayableImage
        imageUrl={imageUrl}
        title={title}
        sx={{ position: 'absolute', top: 15, left: 15, zIndex: 2 }}
        onPlay={onPlay}
        playlist={playlist}
        mediaSrc={mediaSrc}
      />

      {/* Nội dung chữ bên phải */}
      <Box sx={{ marginLeft: '160px', zIndex: 3, paddingBottom: 3, position: 'relative' }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color={variant === 'simple' ? 'text.primary' : 'white'}
          sx={{ lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        {/* ✅ Hiển thị tên ca sĩ */}
        <Typography
          variant="caption"
          color={variant === 'simple' ? 'text.secondary' : '#ccc'}
          mt={0.5}
          sx={{ display: 'block' }}
        >
          {artist}
        </Typography>
      </Box>
    </BaseCard>
  );
}

export default PlaylistCardSafe;
