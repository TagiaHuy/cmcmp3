// src/pages/ChartListPage.js
import React from 'react';
import { Box, Paper, Typography, Skeleton, IconButton, Tooltip } from '@mui/material'; // Import IconButton and Tooltip
import { useTheme } from '@mui/material/styles';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'; // Import Play icon
import useZingChart from '../hooks/useZingChart';
import ChartSongList from '../components/SongList/ChartSongList';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import StyledZingChart from '../components/Chart/StyledZingChart';

const ChartListPage = () => {
  const { loading, data, error, chartDataset, lineChartMetadata } = useZingChart();
  const { loadQueue } = useMediaPlayer();
  const theme = useTheme();

  const createQueue = (items) => {
    return items.map(s => ({
      id: s.id ?? `zingchart-${s.rank}`,
      title: s.title,
      artists: s.artists,
      imageUrl: s.cover,
      mediaSrc: s.mediaSrc,
      rank: s.rank,
      source: "zingchart-full-list",
    }));
  };

  const onPlayChartItem = (item) => {
    if (!item || !data?.items) return;

    const startIndex = data.items.findIndex(s => s.id === item.id || s.rank === item.rank);
    const queue = createQueue(data.items);
    loadQueue(queue, startIndex !== -1 ? startIndex : 0);
  };
  
  const handlePlayChart = () => {
    if (!data?.items || data.items.length === 0) return;
    const queue = createQueue(data.items);
    loadQueue(queue, 0); // Start from the first song
  };

  // Adjusted loading state handling for initial full-page skeleton
  if (loading && !data && !error) { 
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={320} sx={{ my: 2, borderRadius: 3 }} />
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            display: 'inline-block',
            background: "linear-gradient(90deg,#ff9933,#bb33ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          #CMCchart
        </Typography>
        <Tooltip title="Phát toàn bộ bảng xếp hạng" arrow>
          <span>
            <IconButton
              onClick={handlePlayChart}
              disabled={!data?.items || data.items.length === 0}
              sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      color: "#fff",
                      background:
                        "radial-gradient(circle at 30% 0%,#ff9a9e 0%,#fad0c4 45%,#f5576c 100%)",
                      boxShadow: "0 6px 18px rgba(0,0,0,.45)",
                      transition: "all .18s ease",
                      "&:hover": {
                        filter: "brightness(1.06)",
                        boxShadow: "0 8px 22px rgba(0,0,0,.6)",
                        transform: "scale(1.08)",
                      },
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        animation: "pulse 1.8s ease infinite",
                        boxShadow: "0 0 0 0 rgba(255,255,255,.28)",
                      },
                      "@keyframes pulse": {
                        "0%": { boxShadow: "0 0 0 0 rgba(255,255,255,.28)" },
                        "70%": { boxShadow: "0 0 0 12px rgba(255,255,255,0)" },
                        "100%": { boxShadow: "0 0 0 0 rgba(255,255,255,0)" },
                      },
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Render the new styled chart */}
      <Box sx={{ height: 320, mb: 4 }}>
        <StyledZingChart chartDataset={chartDataset} lineChartMetadata={lineChartMetadata} />
      </Box>

      <Paper
        sx={{
          p: 2, borderRadius: 3,
          opacity: loading ? 0.7 : 1, // Add opacity change for loading state
          transition: 'opacity 0.3s',
          backgroundColor: (t) => t.palette.background.table, // Set background color to match AdminUsersPage
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