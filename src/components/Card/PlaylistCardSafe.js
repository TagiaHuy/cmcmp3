import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMediaPlayer, normalizeArtists } from '../../context/MediaPlayerContext';
import BaseCard from './BaseCard';
import CardTag from './CardTag';
import PlayableImage from './PlayableImage';

// Fallback nền blur mượt
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
  const { handlePlay } = useMediaPlayer();

  if (!playlist) return null;

  // =============================
  // ⭐ Chuẩn hóa dữ liệu Playlist
  // =============================
  const title =
    playlist.name ||
    playlist.title ||
    'Playlist';

  const artistRaw =
    playlist.artist ||
    playlist.creatorDisplayName ||
    'Không rõ nghệ sĩ';

  const artistText = normalizeArtists(artistRaw);

  const imageUrl = playlist.imageUrl || '';
  const mediaSrc = playlist.mediaSrc || null;

  // Nền blur fallback
  const safeBg = imageUrl || FALLBACK_BG;

  // ============================================
  // ⭐ Tạo unifiedTrack nếu người dùng click PLAY
  // ============================================
  const unifiedTrack = {
    id: playlist.id,
    title,
    imageUrl,
    mediaSrc,
    artists: artistText,
  };

  const handlePlayClick = () => {
    if (onPlay) {
      // Nếu cha đã truyền onPlay riêng → dùng đúng logic cha
      onPlay(playlist);
    } else {
      // Mặc định: play playlist như một bài
      handlePlay(unifiedTrack);
    }
  };

  // ============================================
  // ⭐ STYLE THẺ
  // ============================================
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
    transition: '0.3s ease-in-out',
    backgroundColor:
      variant === 'simple'
        ? (t) => t.palette.action.hover
        : 'transparent',

    '&:hover': {
      boxShadow: '0 8px 20px rgba(0,0,0,.4)',
      background:
        variant === 'simple'
          ? (t) => t.palette.action.selected
          : 'linear-gradient(to bottom, #fff 0%, #fff 50%)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,.4), transparent)',
      zIndex: 1,
      display: variant === 'simple' ? 'none' : 'block',
    },
  };

  return (
    <BaseCard sx={cardStyle}>
      {/* Nền blur */}
      {variant === 'default' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${safeBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(8px)',
              transform: 'scale(1.02)',
              zIndex: 0,
            }}
          />

          <CardTag text="CÓ THỂ BẠN THÍCH" />
        </>
      )}

      {/* Ảnh Playlist + nút PLAY */}
      <PlayableImage
        imageUrl={imageUrl}
        title={title}
        mediaSrc={mediaSrc}
        sx={{ 
          position: 'absolute', 
          top: 15, 
          left: 15, 
          zIndex: 2 
        }}
        onPlay={handlePlayClick}
      />

      {/* Text */}
      <Box
        sx={{
          marginLeft: '160px',
          zIndex: 3,
          paddingBottom: 3,
          position: 'relative',
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color={variant === 'simple' ? 'text.primary' : 'white'}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          color={variant === 'simple' ? 'text.secondary' : '#ccc'}
          sx={{ mt: 0.5, display: 'block' }}
        >
          {artistText}
        </Typography>
      </Box>
    </BaseCard>
  );
}

export default PlaylistCardSafe;
