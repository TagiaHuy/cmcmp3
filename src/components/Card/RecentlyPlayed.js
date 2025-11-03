import React from 'react';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';
import PlayableImage from './PlayableImage';

const RecentlyPlayed = () => {
  const { recentlyPlayed, handlePlay } = useMediaPlayer();
  const theme = useTheme();

  if (!recentlyPlayed || recentlyPlayed.length === 0) return null;

  const visiblePlaylists = recentlyPlayed.slice(0, 6);

  return (
    <Box sx={{ my: 4, ml: 11, mr: 11 }}>   {/* 👈 Căn lề giống banner */}
      {/* Tiêu đề và nút "Tất cả" */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
          Nghe gần đây
        </Typography>
        <Link
          to="/recently-played"
          style={{
            textDecoration: 'none',
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          Tất cả
        </Link>
      </Box>

      {/* Danh sách playlist */}
      <Grid container spacing={3}>
        {visiblePlaylists.map((playlist, index) => (
          <Grid item key={index} sx={{ width: 160 }}>
            <Box sx={{ textAlign: 'center' }}>
              <PlayableImage
                playlist={playlist}
                onPlay={handlePlay}
                imageUrl={playlist.imageUrl}
                title={playlist.title}
                size={150}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.primary,
                  mt: 1,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {playlist.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {playlist.artists}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecentlyPlayed;
