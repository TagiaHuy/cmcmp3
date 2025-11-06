// src/components/Chart/ZingChartSection.jsx
import React, { useMemo } from "react";
import { Box, Paper, Typography, Button, Stack, Skeleton, IconButton } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useTheme, alpha } from "@mui/material/styles";
import useZingChart from "../../hooks/useZingChart";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useMediaPlayer } from "../../context/MediaPlayerContext";

/* ========== Sub components ========== */
function RankNumber({ rank }) {
  const gradient =
    rank === 1
      ? "linear-gradient(90deg,#4facfe,#38f9d7)"      // 1: xanh dương -> xanh neon
      : rank === 2
      ? "linear-gradient(90deg,#43e97b,#fef9a7)"      // 2: xanh lá -> vàng
      : "linear-gradient(90deg,#fa709a,#fee140)";     // 3: đỏ -> hồng

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
  if (!item) return null;

  const onClickPlay = (e) => {
    e?.stopPropagation();
    onPlay?.(item);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.2}
      onClick={() => onPlay?.(item)}
      role="button"
      tabIndex={0}
      sx={{
        p: 1.2,
        borderRadius: 1.5,
        bgcolor: "rgba(255,255,255,0.06)",              // nền tím mờ giống Zing
        cursor: "pointer",
        transition: "transform .12s ease, background .12s ease",
        "&:hover": { transform: "translateY(-1px)", bgcolor: "rgba(255,255,255,0.12)" },
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
            bgcolor: "transparent",    // không có vòng tròn đen
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const hit = payload[0]?.payload;
  return (
    <Paper elevation={3} sx={{ p: 1, borderRadius: 1.5 }}>
      <Typography variant="caption">{label}</Typography>
      <Stack spacing={0.5} sx={{ mt: .5 }}>
        <Typography variant="body2">VN: {hit?.vn ?? 0}%</Typography>
        <Typography variant="body2">US-UK: {hit?.usuk ?? 0}%</Typography>
        <Typography variant="body2">K-POP: {hit?.kpop ?? 0}%</Typography>
      </Stack>
    </Paper>
  );
}

/* ========== Main ========== */
export default function ZingChartSection() {
  const { loading, data, tiles } = useZingChart();
  const theme = useTheme();
  const { handlePlay } = useMediaPlayer();

  const colors = useMemo(() => ({
    vn:   theme.palette.mode === "dark" ? "#73B5FF" : "#1976d2",
    usuk: theme.palette.mode === "dark" ? "#FF6EA9" : "#d81b60",
    kpop: theme.palette.mode === "dark" ? "#6EE7B7" : "#2e7d32",
  }), [theme.palette.mode]);

  if (loading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Skeleton variant="rounded" height={320} />
      </Paper>
    );
  }
  if (!data) return null;

  // Dữ liệu line chart
  const tl   = data?.timeline ?? [];
  const vn   = data?.vn ?? [];
  const usuk = data?.usuk ?? [];
  const kpop = data?.kpop ?? [];

  const chartData = tl.map((t, i) => ({
    time: t,
    vn:   vn[i]   ?? 0,
    usuk: usuk[i] ?? 0,
    kpop: kpop[i] ?? 0,
  }));

  const top3 = Array.isArray(data?.top3) ? data.top3 : [];

  // Chuẩn hoá object truyền vào MediaPlayer
  const onPlayTop = (item) => {
    handlePlay?.({
      id: item.id ?? `zingchart-${item.rank}`,
      title: item.title,
      artists: item.artists,
      imageUrl: item.cover,
      mediaSrc: item.mediaSrc, // cần có để phát nhạc
      percent: item.percent,
      rank: item.rank,
      source: "zingchart",
    });
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                mb: 1,
                background: "linear-gradient(90deg,#ff9933,#bb33ff)", // gradient #zingchart
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              #zingchart
            </Typography>

            <Stack spacing={1.1}>
              {top3.map((item) => (
                <TopItem key={item.rank} item={item} onPlay={onPlayTop} />
              ))}
            </Stack>

            <Button variant="outlined" size="small" sx={{ mt: 2, borderRadius: 999 }}>
              Xem thêm
            </Button>
          </Box>

          {/* Right: chart */}
          <Box sx={{ flex: 1, minWidth: 0, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 8, right: 16, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="vn"   stroke={colors.vn}   dot={{ r: 3 }} strokeWidth={2} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="usuk" stroke={colors.usuk} dot={{ r: 3 }} strokeWidth={2} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="kpop" stroke={colors.kpop} dot={{ r: 3 }} strokeWidth={2} activeDot={{ r: 5 }} />
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
