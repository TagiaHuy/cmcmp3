// src/components/Card/SongCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import PlayableImage from './PlayableImage'; // Re-using the playable image component

const SongCard = ({ song, onPlay }) => {
  const { handlePlay, normalizeArtists } = useMediaPlayer();

  if (!song) return null;

  // 👉 Hàm play thống nhất: ưu tiên onPlay từ props, nếu không có thì dùng handlePlay
  const handlePlayClick = () => {
    if (!song) return;

    if (onPlay) {
      // Parent (TopSongsSection, Carousel, ...) sẽ lo queue + Next/Prev
      onPlay(song);
    } else {
      // Fallback: play trực tiếp 1 bài như trước
      handlePlay({
        id: song.id,
        title: song.title,
        mediaSrc: song.mediaSrc || song.audioUrl,
        imageUrl: song.imageUrl,
        artists: normalizeArtists
          ? normalizeArtists(song.artists)
          : song.artists?.map((a) => a.name).join(', ') || 'Unknown Artist',
      });
    }
  };

  const artistsText =
    (normalizeArtists
      ? normalizeArtists(song.artists)
      : song.artists?.map((artist) => artist.name).join(', ')) || 'Unknown Artist';

  return (
    <Box sx={{ position: 'relative', width: 180, cursor: 'pointer' }}>
      <Card
        onClick={handlePlayClick}
        sx={{
          width: '100%',
          transition: 'transform .2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <PlayableImage
          imageUrl={song.imageUrl}
          title={song.title}
          onPlay={handlePlayClick}
          size={180}
        />

        <CardContent>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            sx={{ color: 'text.primary' }}
          >
            {song.title}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{ color: 'text.secondary' }}
          >
            {artistsText}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SongCard;
