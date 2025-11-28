// src/components/SongList/ChartSongList.js
import React from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

// Helper component for rank number - reused from ZingChartSection
function RankNumber({ rank }) {
  const gradient =
    rank === 1
      ? "linear-gradient(90deg,#4facfe,#38f9d7)"
      : rank === 2
      ? "linear-gradient(90deg,#43e97b,#fef9a7)"
      : rank === 3
      ? "linear-gradient(90deg,#fa709a,#fee140)"
      : undefined; // Default for ranks > 3

  return (
    <Typography
      variant="h5"
      sx={{
        width: 26,
        fontWeight: 900,
        background: gradient || 'inherit',
        WebkitBackgroundClip: gradient ? "text" : undefined,
        WebkitTextFillColor: gradient ? "transparent" : undefined,
        lineHeight: 1,
        color: !gradient ? 'text.primary' : undefined, // Fallback color for ranks > 3
      }}
    >
      {rank}
    </Typography>
  );
}

const ChartSongListItem = ({ item, onPlay }) => {
  const navigate = useNavigate();

  const onClickPlay = (e) => {
    e?.stopPropagation();
    onPlay?.(item);
  };

  const handleCardClick = () => {
    navigate(`/songs/${item.id}`);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.2}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      sx={{
        p: 1.2,
        borderRadius: 1.5,
        bgcolor: "rgba(255,255,255,0.06)",
        cursor: "pointer",
        transition: "transform .12s ease, background .12s ease",
        "&:hover": { transform: "translateY(-1px)", bgcolor: "rgba(255,255,255,0.12)" },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
      }}
    >
      <RankNumber rank={item.rank} />

      <Box
        sx={{
          position: "relative",
          width: 46,
          height: 46,
          mr: 0.5,
          borderRadius: 1,
          overflow: "hidden",
          flexShrink: 0,
          "&:hover img": { filter: "brightness(.78)" },
          "&:hover .hoverPlay": { opacity: 1, transform: "translate(-50%,-50%) scale(1)" },
        }}
      >
        <Box
          component="img"
          src={item.cover}
          alt={item.title}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        <IconButton
          className="hoverPlay"
          onClick={onClickPlay}
          size="small"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) scale(.9)",
            opacity: 0,
            transition: "all .18s ease",
            bgcolor: "transparent",
            color: "#fff",
            "&:hover": { color: "#fff" },
            boxShadow: "none",
            width: 28,
            height: 28,
            p: 0,
          }}
        >
          <PlayArrowRoundedIcon sx={{ fontSize: 26 }} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 700 }}>{item.title}</Typography>
        <Typography noWrap variant="body2" color="text.secondary">{item.artists}</Typography>
      </Box>

      {/* Optionally display listenCount if desired, or duration */}
      <Typography sx={{ fontWeight: 600, color: 'text.secondary', minWidth: '60px', textAlign: 'right' }}>
        {item.listenCount ? item.listenCount.toLocaleString() : ''}
      </Typography>
    </Stack>
  );
};

const ChartSongList = ({ items, onPlay }) => {
  if (!items || items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        No chart data available.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.1}>
      {items.map((item) => (
        <ChartSongListItem key={item.id || item.rank} item={item} onPlay={onPlay} />
      ))}
    </Stack>
  );
};

export default ChartSongList;
