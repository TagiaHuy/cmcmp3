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

const IMG_H = 160;           // kích thước thumbnail (vuông)
const PLAY_DIAMETER = 42;

const BTN_BOX = 44;
const GAP_PX  = 16;          // khoảng cách giữa 3 nút
const TWEAK_Y = -22;         // nắn nhẹ vị trí theo trục Y để triệt tiêu lệch thị giác

export default function RecentlyPlayed() {
  const { recentlyPlayed, handlePlay, addToLibrary } = useMediaPlayer();
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
          style={{ textDecoration: 'none', color: theme.palette.text.secondary, fontSize: '0.875rem', opacity: 0.85 }}
        >
          TẤT CẢ &gt;
        </Link>
      </Box>

      {/* ✅ 6 thẻ luôn cùng 1 hàng, giãn/thu mượt theo bề ngang content
          - Không xuống dòng (nowrap)
          - Khoảng cách auto giãn bằng space-between
          - Nếu không đủ chỗ: bật scroll ngang mảnh để giữ đúng 6 thẻ/1 hàng */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'nowrap',                 // ❗ Không cho xuống dòng
          justifyContent: 'space-between',    // ✅ Giãn khoảng cách mượt
          gap: 3,                             
          transition: 'gap .3s ease',         // mượt khi layout thay đổi
          willChange: 'gap',
          // Nếu không đủ bề ngang cho 6×160 + gaps -> cho phép scroll ngang
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(127,127,127,.35)',
            borderRadius: 4,
          },
          // Giới hạn tối thiểu để cố gắng không cần scroll khi có thể
          minWidth: 'min(100%, 6 * 160px + 5 * 24px)', // 24px ≈ theme.spacing(3)
        }}
      >
        {visiblePlaylists.map((track, idx) => (
          <Box
            key={idx}
            sx={{
              width: 160,
              flex: '0 0 160px',               // ✅ cố định thẻ 160px
              transition: 'transform .3s ease',
            }}
          >
            <RecentlyPlayedItem
              track={track}
              onPlay={() => handlePlay(track)}
              onFavorite={() => addToLibrary?.(track)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function RecentlyPlayedItem({ track, onPlay, onFavorite }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const mediaUrl = track.mediaSrc || track.audioUrl;

  return (
    <Box
      sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ảnh + ▶ trung tâm do BasePlayableImage quản lý */}
      <BasePlayableImage mediaSrc={mediaUrl} onPlay={onPlay} size={IMG_H} isHovered={isHovered}>
        <img
          src={track.imageUrl}
          alt={track.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 8 }}
        />
      </BasePlayableImage>

      {/* Hàng nút ❤️  [spacer = PLAY_DIAMETER]  ⋯ — hover mới hiện, không che click ▶ */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity .25s',
          pointerEvents: 'none', // để click được nút ▶ ở giữa
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
          {/* ❤️ */}
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
            aria-label="Thêm vào thư viện"
          >
            <FavoriteButton visible={isHovered} />
          </Box>

          {/* Spacer = đúng bằng đường kính icon ▶ để 3 nút thẳng hàng */}
          <Box sx={{ width: PLAY_DIAMETER, height: PLAY_DIAMETER, pointerEvents: 'none' }} />

          {/* ⋯ */}
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
            aria-label="Tùy chọn khác"
          >
            <MoreButton visible={isHovered} />
          </Box>
        </Box>
      </Box>

      {/* Text */}
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
        title={track.artists}
      >
        {track.artists}
      </Typography>
    </Box>
  );
}
