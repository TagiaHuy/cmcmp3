// src/components/Card/RecentlyPlayed.js
import React from 'react';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// Đồng bộ với Top100 / Base
import BasePlayableImage from './Base/BasePlayableImage';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';

const IMG_H = 160;           
const PLAY_DIAMETER = 42;

const BTN_BOX = 44;
const GAP_PX  = 16;          
const TWEAK_Y = -22;         

export default function RecentlyPlayed() {
  const { recentlyPlayed, handlePlay, addToLibrary, normalizeArtists } = useMediaPlayer();
  const theme = useTheme();

  if (!recentlyPlayed?.length) return null;

  const visiblePlaylists = recentlyPlayed.slice(0, 6);

  return (
    <Box sx={{ my: 4, ml: 11, mr: 11 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
          Nghe gần đây
        </Typography>
        <Link
          to="/recently-played"
          style={{
            textDecoration: 'none',
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
            opacity: 0.85
          }}
        >
          TẤT CẢ &gt;
        </Link>
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          gap: 3,
          transition: 'gap .3s ease',
          willChange: 'gap',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(127,127,127,.35)',
            borderRadius: 4,
          },
          minWidth: 'min(100%, 6 * 160px + 5 * 24px)',
        }}
      >
        {visiblePlaylists.map((track, idx) => (
          <Box
            key={idx}
            sx={{
              width: 160,
              flex: '0 0 160px',
              transition: 'transform .3s ease',
            }}
          >
            <RecentlyPlayedItem
              track={track}
              normalizeArtists={normalizeArtists}
              onPlay={() => handlePlay(track)}
              onFavorite={() => addToLibrary?.(track)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function RecentlyPlayedItem({ track, onPlay, onFavorite, normalizeArtists }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const mediaUrl = track.mediaSrc || track.audioUrl;

  // ⭐ CHUẨN HÓA ARTISTS → luôn là string
  const artistText = normalizeArtists(track.artists);

  return (
    <Box
      sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ảnh + nút ▶ */}
      <BasePlayableImage mediaSrc={mediaUrl} onPlay={onPlay} size={IMG_H} isHovered={isHovered}>
        <img
          src={track.imageUrl}
          alt={track.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 8
          }}
        />
      </BasePlayableImage>

      {/* Nút hover: ❤️  [space]  ⋯ */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity .25s',
          pointerEvents: 'none',
          zIndex: 5,
          lineHeight: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: `${GAP_PX}px`,
            transform: `translateY(${TWEAK_Y}px)`,
          }}
        >
          <Box
            sx={{
              width: BTN_BOX,
              height: BTN_BOX,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={(e) => { e.stopPropagation(); onFavorite?.(); }}
          >
            <FavoriteButton visible={isHovered} />
          </Box>

          <Box sx={{ width: PLAY_DIAMETER, height: PLAY_DIAMETER }} />

          <Box
            sx={{
              width: BTN_BOX,
              height: BTN_BOX,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={(e) => { e.stopPropagation(); console.log('More:', track.title); }}
          >
            <MoreButton visible={isHovered} />
          </Box>
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="subtitle1"
        sx={{
          color: 'text.primary',
          mt: 1,
          fontWeight: 700,
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        title={track.title}
      >
        {track.title}
      </Typography>

      {/* ⭐ ARTISTS (đã normalize) */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          mt: 0.25,
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        title={artistText}
      >
        {artistText}
      </Typography>
    </Box>
  );
}
