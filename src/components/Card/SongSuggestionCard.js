
// src/components/Card/SongSuggestionCard.js
import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

const formatArtists = (artists) => {
  if (!artists) return '';
  if (Array.isArray(artists)) return artists.map((a) => a?.name || a).join(', ');
  return artists;
};

const SongSuggestionCard = ({ song, onPlay }) => {
  const cover =
    song?.imageUrl ||
    song?.coverImage ||
    song?.thumbnail ||
    song?.album?.cover ||
    song?.image ||
    '/placeholder-cover.png';

  const title = song?.title || song?.name || 'Bài hát';
  const artists = formatArtists(song?.artists || song?.artist);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    // Truyền tối thiểu { id, title, artists, audioUrl } tùy theo player của bạn
    onPlay?.({
      id: song?.id,
      title,
      artists,
      // Tùy schema dữ liệu của bạn:
      src: song?.previewUrl || song?.audioUrl || song?.streamUrl,
      cover,
    });
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={handlePlayClick}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        p: 1.25,
        borderRadius: 1.5,
        gap: 1.5,
        cursor: 'pointer',
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(0,0,0,0.03)',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
          boxShadow: theme.shadows[2],
          '& .play-btn': {
            opacity: 1,
            transform: 'translateX(0)'
          }
        }
      })}
    >
      {/* Cover */}
      <Box
        component="img"
        src={cover}
        alt={title}
        sx={{
          width: 60,
          height: 60,
          objectFit: 'cover',
          borderRadius: 1,
          flexShrink: 0
        }}
        loading="lazy"
      />

      {/* Texts */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Tooltip title={title} placement="top" arrow>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              fontWeight: 700,
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            })}
          >
            {title}
          </Typography>
        </Tooltip>

        <Tooltip title={artists} placement="top" arrow>
          <Typography
            variant="caption"
            sx={(theme) => ({
              mt: 0.5,
              color: theme.palette.text.secondary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            })}
          >
            {artists}
          </Typography>
        </Tooltip>
      </Box>

      {/* Play (hiện khi hover) */}
      <IconButton
        className="play-btn"
        aria-label="Phát"
        onClick={handlePlayClick}
        size="small"
        sx={(theme) => ({
          opacity: 0,
          transform: 'translateX(8px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          color: theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : theme.palette.text.primary,
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.06)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(0,0,0,0.1)'
          }
        })}
      >
        <PlayArrowRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default SongSuggestionCard;
