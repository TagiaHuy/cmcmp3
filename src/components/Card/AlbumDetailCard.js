import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteAlbumButton from '../Button/Specific/FavoriteAlbumButton';
import PrimaryPlaybackButton from '../Button/Specific/PrimaryPlaybackButton';

const AlbumDetailCard = ({ album, handlePlayAlbum, isPlaying, onLikeToggle }) => {
  const creatorName = album.creator?.name || "Người dùng";

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
      {/* 1. Album Image */}
      <Box
        component="img"
        sx={{
          width: { xs: 250, md: 350 },
          height: { xs: 250, md: 350 },
          objectFit: 'cover',
          borderRadius: 4,
          mb: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        }}
        src={album.imageUrl}
        alt={album.title}
      />

      {/* 2. Title & Creator */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h3" color="text.primary" fontWeight={800}>
          {album.title}
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          fontWeight={600}
          sx={{ opacity: 0.85 }}
        >
          {creatorName}
        </Typography>
      </Stack>

      {/* 3. Action Buttons */}
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
        {/* Play Button */}
        <PrimaryPlaybackButton
          isPlaying={isPlaying}
          handlePlayPause={handlePlayAlbum}
        />
        {/* Favorite Button */}
        <FavoriteAlbumButton albumId={album.id} isFavorite={album.isFavorite} onLikeToggle={onLikeToggle} />
      </Stack>

      {/* 4. Stats */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <FavoriteBorderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {album.likeCount || 0}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <MusicNoteIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {album.songCount || 0} songs
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AlbumDetailCard;
