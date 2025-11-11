    import React from 'react';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { Box, Typography, Grid } from '@mui/material';
import PlaylistCard from '../components/Card/PlaylistCard';
import { useTheme } from '@mui/material/styles';

const RecentlyPlayedPage = () => {
  const { recentlyPlayed, loadQueue } = useMediaPlayer(); // Import loadQueue
  const theme = useTheme();

  const handlePlayRecentlyPlayed = (item, index) => {
    loadQueue(recentlyPlayed, index); // Load entire list and start from clicked item
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Nghe gần đây
      </Typography>
      {recentlyPlayed.length > 0 ? (
        <Grid container spacing={3}>
          {recentlyPlayed.map((playlist, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <PlaylistCard playlist={playlist} onPlay={(item) => handlePlayRecentlyPlayed(item, index)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Chưa có bài hát nào trong danh sách nghe gần đây.</Typography>
      )}
    </Box>
  );
};

export default RecentlyPlayedPage;
