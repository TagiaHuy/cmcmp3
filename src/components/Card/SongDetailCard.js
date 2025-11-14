import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreButton from '../Button/Specific/MoreButton';
import { useMediaPlayer, normalizeArtists } from '../../context/MediaPlayerContext';
import PrimaryPlaybackButton from '../Button/Specific/PrimaryPlaybackButton';
import FavoriteButton from '../Button/Specific/FavoriteButton';

const SongDetailCard = ({ song }) => {
  const { handlePlay, currentTrack } = useMediaPlayer();

  // ⭐ Chuẩn hóa artists về string
  const artistText = normalizeArtists(song?.artists);

  // ⭐ Kiểm tra bài đang phát
  const isPlaying =
    currentTrack &&
    currentTrack.mediaSrc === (song.mediaSrc || song.audioUrl);

  // ⭐ Kiểm tra đã thích chưa
  const isLiked = song?.isFavorite || false;

  // ⭐ Tạo đúng format track để handlePlay() nhận
  const unifiedTrack = {
    id: song.id,
    title: song.title,
    mediaSrc: song.mediaSrc || song.audioUrl,
    imageUrl: song.imageUrl,
    artists: artistText
  };

  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 450,
        mx: 'auto',
      }}
    >
      {/* 1. Ảnh bài hát */}
      <Box
        component="img"
        sx={{
          width: { xs: 250, md: 350 },
          height: { xs: 250, md: 350 },
          objectFit: 'cover',
          borderRadius: 4,
          mb: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.02)' }
        }}
        src={song.imageUrl}
        alt={song.title}
      />

      {/* 2. Tiêu đề & nghệ sĩ */}
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h3" color="text.primary" fontWeight={800}>
          {song.title}
        </Typography>

        <Typography
          variant="h5"
          color="text.secondary"
          fontWeight={600}
          sx={{ opacity: 0.85 }}
        >
          {artistText}
        </Typography>
      </Stack>

      {/* 3. Action Buttons */}
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <FavoriteButton isFavorite={isLiked} />

        {/* ⭐ Play chính → truyền unifiedTrack */}
        <PrimaryPlaybackButton
          isPlaying={isPlaying}
          handlePlayPause={() => handlePlay(unifiedTrack)}
        />

        <MoreButton />
      </Stack>

      {/* 4. Stats nhỏ */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <HeadsetMicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {song.listenCount || 0}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <FavoriteBorderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {song.likeCount || 0}
          </Typography>
        </Stack>
      </Stack>

      {/* 5. Mô tả & nhãn */}
      {song.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, px: 2 }}
        >
          {song.description}
        </Typography>
      )}

      <Typography variant="caption" color="text.disabled" sx={{ mb: 1 }}>
        {song.label || 'Không rõ'} | Phát hành: {song.createdAt || '—'}
      </Typography>
    </Box>
  );
};

export default SongDetailCard;
