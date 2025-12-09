import React, { useState } from 'react';
import { Box, Typography, Stack, Menu } from '@mui/material'; // Removed MenuItem, ListItemIcon, ListItemText
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// Removed DownloadOutlinedIcon
import MoreButton from '../Button/Specific/MoreButton';
import { useMediaPlayer, normalizeArtists } from '../../context/MediaPlayerContext';
import PrimaryPlaybackButton from '../Button/Specific/PrimaryPlaybackButton';
import FavoriteButton from '../Button/Specific/FavoriteButton';
// Removed downloadSong and useNotifications
import DownloadMenuItem from '../MenuItem/Specific/DownloadMenuItem'; // Import the new reusable component

import ShareMenu from '../MenuItem/Specific/ShareMenu'; // Import ShareMenu

const SongDetailCard = ({ song, onLikeToggle }) => {
  const { handlePlay, currentTrack, isPlaying: isPlayerPlaying, setIsPlaying } = useMediaPlayer();
  // Removed useNotifications

  const [anchorEl, setAnchorEl] = useState(null); // State for MoreButton menu
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Removed handleDownload function

  // ⭐ Chuẩn hóa artists về string
  const artistText = normalizeArtists(song?.artists);

  // ⭐ Kiểm tra bài đang phát
  const isThisSongPlaying =
    isPlayerPlaying &&
    currentTrack &&
    (currentTrack.mediaSrc === (song.mediaSrc || song.filePath || song.audioUrl) || currentTrack.id === song.id);

  // ⭐ Kiểm tra đã thích chưa
  const isLiked = song?.isFavorite || false;

  // ⭐ Tạo đúng format track để handlePlay() nhận
  const unifiedTrack = {
    id: song.id,
    title: song.title,
    mediaSrc: song.filePath || song.mediaSrc || song.audioUrl,
    imageUrl: song.imageUrl,
    artists: artistText
  };

  const handleTogglePlay = () => {
    // If this song is the current track, toggle play/pause
    if (currentTrack && currentTrack.id === song.id) {
        setIsPlaying(prev => !prev);
    } else {
        // If it's a different song, start playing it
        handlePlay(unifiedTrack);
    }
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
        <FavoriteButton songId={song.id} isFavorite={isLiked} onLikeToggle={onLikeToggle} />

        {/* ⭐ Play chính → truyền unifiedTrack */}
        <PrimaryPlaybackButton
          isPlaying={isThisSongPlaying}
          handlePlayPause={handleTogglePlay}
        />

        <MoreButton onClick={handleMenuOpen} />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'more-button',
          }}
        >
          <DownloadMenuItem songId={song.id} songTitle={song.title} onCloseMenu={handleMenuClose} />
          <ShareMenu anchorEl={anchorEl} open={open} onCloseMenu={handleMenuClose} type="song" id={song.id} />
        </Menu>
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
