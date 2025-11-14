// src/components/Card/SongCardDetailed.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseCard from './BaseCard';
import PlayableImage from './PlayableImage';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

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

function SongCardDetailed({ song, onPlay }) {
  const { handlePlay, normalizeArtists } = useMediaPlayer();

  if (!song) return null;

  // ⭐ Chuẩn hóa artists
  const artistText = normalizeArtists
    ? normalizeArtists(song.artists)
    : song.artists;

  // ⭐ chuẩn unified track
  const unifiedTrack = {
    id: song.id,
    title: song.title,
    imageUrl: song.imageUrl,
    mediaSrc: song.mediaSrc || song.audioUrl,
    artists: artistText,
  };

  const handlePlayClick = (e) => {
    e?.stopPropagation?.();
    if (onPlay) {
      // Parent (TopSongsSection / SongCarousel) sẽ lo loadQueue + Next/Prev
      onPlay(unifiedTrack);
    } else {
      // Fallback: play trực tiếp 1 bài
      handlePlay(unifiedTrack);
    }
  };

  const {
    title = 'Unknown Song',
    imageUrl = '',
  } = song;

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

    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)',
      zIndex: 1,
    },
  };

  return (
    <BaseCard sx={cardStyle} onClick={handlePlayClick}>
      {/* Nền blur */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${safeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)',
          transform: 'scale(1.05)',
          willChange: 'filter, transform',
          zIndex: 0,
        }}
      />

      {/* Ảnh phát */}
      <PlayableImage
        imageUrl={imageUrl}
        title={title}
        size={130}
        mediaSrc={unifiedTrack.mediaSrc}
        sx={{ position: 'absolute', top: 15, left: 15, zIndex: 2 }}
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
          color="white"
          sx={{ lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          color="#ccc"
          sx={{ display: 'block', mt: 0.5 }}
        >
          {artistText}
        </Typography>
      </Box>
    </BaseCard>
  );
}

export default SongCardDetailed;
