// src/components/Chart/ZingChartSection.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Skeleton,
  IconButton,
  Tooltip as MuiTooltip,
} from "@mui/material";
import useZingChart from "../../hooks/useZingChart";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useMediaPlayer } from "../../context/MediaPlayerContext";
import { useNavigate } from "react-router-dom";
import StyledZingChart from "./StyledZingChart"; // Import the new reusable chart

/* ========== Sub components ========== */
function RankNumber({ rank }) {
  const gradient =
    rank === 1
      ? "linear-gradient(90deg,#4facfe,#38f9d7)"
      : rank === 2
      ? "linear-gradient(90deg,#43e97b,#fef9a7)"
      : "linear-gradient(90deg,#fa709a,#fee140)";

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
        borderRadius: 2,
        // Khung top3 nhạt giống ZingMP3
        bgcolor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.09)",
        cursor: "pointer",
        transition: "transform .12s ease, background .12s ease, border .12s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          bgcolor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.18)",
        },
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
          borderRadius: 1.2,
          overflow: "hidden",
          flexShrink: 0,
          "&:hover img": { filter: "brightness(.78)" },
          "&:hover .hoverPlay": {
            opacity: 1,
            transform: "translate(-50%,-50%) scale(1)",
          },
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
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { color: "#fff", bgcolor: "rgba(0,0,0,0.8)" },
            boxShadow: "0 4px 10px rgba(0,0,0,.5)",
            width: 28,
            height: 28,
            p: 0,
          }}
        >
          <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* ➜ Luôn trắng (light/dark đều ok) */}
        <Typography
          noWrap
          sx={{ fontWeight: 700, fontSize: 14, color: "#ffffff" }}
        >
          {item.title}
        </Typography>
        <Typography
          noWrap
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
        >
          {Array.isArray(item.artists) ? item.artists.map(a => a.name).join(', ') : item.artists}
        </Typography>
      </Box>

      {/* ➜ % cũng trắng */}
      <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#ffffff" }}>
        {item.percent}%
      </Typography>
    </Stack>
  );
}

export default function ZingChartSection() {
  const { loading, data, tiles, chartDataset, lineChartMetadata } = useZingChart();
  const { loadQueue, currentTrack } = useMediaPlayer();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg,#4b1d6f 0%,#5b2b82 50%,#3a1459 100%)",
        }}
      >
        <Skeleton variant="rounded" height={320} />
      </Paper>
    );
  }
  if (!data) return null;

  const top3 = Array.isArray(data?.top3) ? data.top3 : [];

  const onPlayTop = (item) => {
    if (!item || !top3.length) return;

    const startIndex = top3.findIndex(
      (s) => s.id === item.id || s.rank === item.rank
    );

    const queue = top3.map((s) => ({
      id: s.id ?? `zingchart-${s.rank}`,
      title: s.title,
      artists: s.artists,
      imageUrl: s.cover,
      mediaSrc: s.mediaSrc,
      percent: s.percent,
      rank: s.rank,
      source: "zingchart",
    }));

    loadQueue?.(queue, startIndex !== -1 ? startIndex : 0);
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {/* Khối lớn: top3 + line chart */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg,#4b1d6f 0%,#5b2b82 50%,#3a1459 100%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
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
                  background: "linear-gradient(90deg,#ffb347,#ff6fd8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: 0.5,
                }}
              >
                #CMCchart
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
                    <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </span>
              </MuiTooltip>
            </Box>

            <Stack spacing={1.1}>
              {top3.map((item) => {
                const isCurrentlyPlaying = item && currentTrack?.id === item.id;
                const displayCover = isCurrentlyPlaying
                  ? currentTrack.imageUrl
                  : item.cover;

                const displayItem = {
                  ...item,
                  cover: displayCover,
                };

                return (
                  <TopItem
                    key={item.rank}
                    item={displayItem}
                    onPlay={onPlayTop}
                  />
                );
              })}
            </Stack>

            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                borderRadius: 999,
                borderColor: "rgba(255,255,255,0.4)",
                color: "rgba(255,255,255,0.95)",
                textTransform: "none",
                fontSize: 13,
                px: 2.8,
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
              onClick={() => navigate("/zing-chart")}
            >
              Xem thêm
            </Button>
          </Box>

          {/* Right: chart */}
          <Box sx={{ flex: 1, minWidth: 0, height: 320 }}>
            <StyledZingChart chartDataset={chartDataset} lineChartMetadata={lineChartMetadata} />
          </Box>
        </Stack>
      </Paper>

      {/* Tiles #zingchart tuần – làm sáng giống ZingMP3 */}
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
              // giảm overlay đen để màu sáng như Zing
              backgroundImage: `linear-gradient(120deg,rgba(0,0,0,0.03),rgba(0,0,0,0.06)),url(${t.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,.7)",
                fontSize: 16,
              }}
            >
              {t.title}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
