// src/pages/ChartListPage.js
import React from 'react';
import { Box, Paper, Typography, Skeleton, Button } from '@mui/material'; // Added Button
import { useTheme, alpha } from '@mui/material/styles';
import useZingChart from '../hooks/useZingChart';
import ChartSongList from '../components/SongList/ChartSongList';
import { useMediaPlayer } from '../context/MediaPlayerContext';

const ChartListPage = () => {
  const { loading, data, error, refresh } = useZingChart(); // Added refresh
  const { loadQueue } = useMediaPlayer();
  const theme = useTheme();

  const onPlayChartItem = (item) => {
    if (!item || !data?.items) return;

    // Find the index of the clicked song within the items array
    const startIndex = data.items.findIndex(s => s.id === item.id || s.rank === item.rank);

    // Load the entire items list into the queue and start playing from the clicked song
    loadQueue(data.items.map(s => ({
      id: s.id ?? `zingchart-${s.rank}`,
      title: s.title,
      artists: s.artists,
      imageUrl: s.cover,
      mediaSrc: s.mediaSrc, // Assuming mediaSrc is available in items
      rank: s.rank,
      source: "zingchart-full-list",
    })), startIndex !== -1 ? startIndex : 0);
  };

  // Adjusted loading state handling for initial full-page skeleton
  if (loading && !data && !error) { 
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
          {[...Array(15)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={60} sx={{ my: 1 }} />
          ))}
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load chart data: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}> {/* Added Box for title and button */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            // Keep mb: 2 here if needed, but it's now controlled by parent Box gap and mb
            display: 'inline-block', // Ensure block-level for consistent background rendering
            background: "linear-gradient(90deg,#ff9933,#bb33ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          #zingchart
        </Typography>
        <Button variant="outlined" onClick={refresh} disabled={loading} size="small"> {/* Added Refresh Button */}
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </Box>
      <Paper
        sx={{
          p: 2, borderRadius: 3,
          opacity: loading ? 0.7 : 1, // Add opacity change for loading state
          transition: 'opacity 0.3s',
          background: (t) =>
            `linear-gradient(135deg, ${alpha(t.palette.primary.dark, .25)} 0%, ${alpha(t.palette.secondary.dark, .25)} 100%)`,
        }}
      >
        {data?.items && data.items.length > 0 ? ( // Check for actual items
          <ChartSongList items={data.items} onPlay={onPlayChartItem} />
        ) : (
          !loading && <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>Không có dữ liệu bảng xếp hạng.</Typography> // Display message if no data
        )}
      </Paper>
    </Box>
  );
};

export default ChartListPage;
