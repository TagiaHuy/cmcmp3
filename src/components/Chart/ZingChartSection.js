// src/components/Chart/ZingChartSection.jsx
import React, { useMemo } from "react";
import { Box, Paper, Typography, Button, Stack, Skeleton, IconButton, Tooltip as MuiTooltip, Avatar } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer
} from "recharts"; // Removed ReferenceLine
import { useTheme, alpha } from "@mui/material/styles";
import useZingChart from "../../hooks/useZingChart";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useMediaPlayer } from "../../context/MediaPlayerContext";
import { useNavigate } from "react-router-dom";

/* ========== Sub components ========== */
function RankNumber({ rank }) {
  const gradient =
    rank === 1
      ? "linear-gradient(90deg,#4facfe,#38f9d7)"
      : rank === 2
      ? "linear-gradient(90deg,#43e97b,#fef9a7)"
      : "linear-gradient(90deg,#fa709a,#fee140)"
      : undefined;

  return (
    <Typography
      variant="h5"
      sx={{
        width: 26,
        fontWeight: 900,
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
      }}
    >
      {rank}
    </Typography>
  );
}

function TopItem({ item, onPlay }) {
  const navigate = useNavigate();
  if (!item) return null;

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
        "&:hover": { transform: "translateY(-2px)", bgcolor: "rgba(255,255,255,0.12)" },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
      }}
    >
      <RankNumber rank={item.rank} />

      {/* Ảnh + nút Play bên trong, chỉ hiện khi hover */}
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

      <Typography sx={{ fontWeight: 800 }}>{item.percent}%</Typography>
    </Stack>
  );
}

/* --- Tooltip hiển thị theo tên bài hát Top 3 --- */
function SongTooltip({ active, payload, label, metadata }) { // Changed 'series' to 'metadata'
  if (!active || !payload?.length) return null;
  const rows = [...payload].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <Paper elevation={3} sx={{ p: 1, borderRadius: 1.5, minWidth: 220 }}>
      <Typography variant="caption">⏱ {label}</Typography>
      <Stack spacing={0.6} sx={{ mt: .6 }}>
        {rows.map((p) => {
          const key = p.dataKey; // e.g., 'song_52'
          const songMeta = metadata?.[key] || {}; // Use metadata to get song info
          return (
            <Stack key={key} direction="row" spacing={1} alignItems="center">
              {songMeta.cover ? <Avatar src={songMeta.cover} sx={{ width: 22, height: 22 }} /> : null}
              <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }} noWrap>
                {songMeta.title || key} - {songMeta.artists}
              </Typography>
              <Typography variant="body2">{p.value ?? 0}%</Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}

// Helper to generate consistent colors for the lines
const lineColors = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff7300", // Orange
  "#00c49f", // Teal
  "#d0ed57", // Lime
  "#a4de6c", // Light Green
  "#ff9800", // Deep Orange
  "#f44336", // Red
  "#2196f3", // Blue
];

// Simple hashing to get consistent color for a given key, or cycle through palette
const getColor = (key) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % lineColors.length;
  return lineColors[index];
};


/* ========== Main ========== */
export default function ZingChartSection() {
  const { loading, data, tiles, chartDataset, lineChartMetadata } = useZingChart();
  const theme = useTheme();
  const { loadQueue, currentTrack } = useMediaPlayer();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Skeleton variant="rounded" height={320} />
      </Paper>
    );
  }
  if (!data) return null;

  // Top 3 từ BE → dùng làm nhãn + ảnh
  const top3 = Array.isArray(data?.top3) ? data.top3 : [];

  const onPlayTop = (item) => {
    if (!item) return;
    
    // Find the index of the clicked song within the top3 array
    const startIndex = top3.findIndex(s => s.id === item.id || s.rank === item.rank);

    // Load the entire top3 list into the queue and start playing from the clicked song
    loadQueue(top3.map(s => ({
      id: s.id ?? `zingchart-${s.rank}`,
      title: s.title,
      artists: s.artists,
      imageUrl: s.cover,
      mediaSrc: s.mediaSrc,
      percent: s.percent,
      rank: s.rank,
      source: "zingchart",
    })), startIndex !== -1 ? startIndex : 0);
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Khối lớn: top3 + line chart */}
      <Paper
        sx={{
          p: 2, borderRadius: 3,
          background: (t) =>
            `linear-gradient(135deg, ${alpha(t.palette.primary.dark, .25)} 0%, ${alpha(t.palette.secondary.dark, .25)} 100%)`,
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Left: Top 3 */}
          <Box sx={{ width: 340 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  mb: 1,
                  background: "linear-gradient(90deg,#ff9933,#bb33ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                #zingchart
              </Typography>

              {/* Nút Play phát bài TOP 1 */}
              <MuiTooltip title="Phát Top 1 #zingchart" arrow>
                <span>
                  <IconButton
                    onClick={() => onPlayTop(top3[0])}
                    size="small"
                    disabled={!top3?.[0]}
                    sx={{
                      mb: 1,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      color: "#fff",
                      background: "linear-gradient(45deg, #7C4DFF, #FF4081)",
                      boxShadow: "0 4px 10px rgba(0,0,0,.25)",
                      transition: "all .18s ease",
                      "&:hover": {
                        filter: "brightness(1.07)",
                        boxShadow: "0 6px 14px rgba(0,0,0,.32)",
                        transform: "scale(1.08)",
                      },
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        animation: "pulse 1.8s ease infinite",
                        boxShadow: "0 0 0 0 rgba(255,255,255,.35)",
                      },
                      "@keyframes pulse": {
                        "0%":   { boxShadow: "0 0 0 0 rgba(255,255,255,.35)" },
                        "70%":  { boxShadow: "0 0 0 10px rgba(255,255,255,0)" },
                        "100%": { boxShadow: "0 0 0 0 rgba(255,255,255,0)" },
                      },
                    }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </span>
              </MuiTooltip>
            </Box>

            <Stack spacing={1.1}>
              {top3.map((item) => {
                const isCurrentlyPlaying = item && currentTrack?.id === item.id;
                const displayCover = isCurrentlyPlaying ? currentTrack.imageUrl : item.cover;

                const displayItem = {
                  ...item,
                  cover: displayCover,
                };

                return <TopItem key={item.rank} item={displayItem} onPlay={onPlayTop} />;
              })}
            </Stack>

            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 2, borderRadius: 999 }}
              onClick={() => navigate('/zing-chart')}
            >
              Xem thêm
            </Button>
          </Box>

          {/* Right: chart */}
          <Box sx={{ flex: 1, minWidth: 0, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataset} margin={{ left: 8, right: 16, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />

                {/* Tooltip hiển thị theo tên bài hát + ảnh */}
                <ReTooltip content={<SongTooltip metadata={lineChartMetadata} />} />

                {/* Dynamically generate Lines from lineChartMetadata */}
                {lineChartMetadata && Object.keys(lineChartMetadata).map((key) => { // Removed index
                  const songMeta = lineChartMetadata[key];
                  return (
                    <Line
                      key={key}
                      name={`${songMeta.title} - ${songMeta.artists}`}
                      type="monotone"
                      dataKey={key} // e.g., song_52
                      stroke={getColor(key)} // Dynamic color
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Paper>

      {/* Tiles #zingchart tuần */}
      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
        {(tiles ?? []).map((t) => (
          <Paper
            key={t.code}
            sx={{
              flex: "1 1 280px",
              minWidth: 280,
              height: 120,
              borderRadius: 2,
              p: 2,
              backgroundImage: `url(${t.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Typography sx={{ fontWeight: 900, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.5)" }}>
              {t.title}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}