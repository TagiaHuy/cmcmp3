// src/components/Chart/StyledZingChart.js
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

/* --- Tooltip hiển thị theo tên bài hát Top 3 --- */
function SongTooltip({ active, payload, label, metadata }) {
  if (!active || !payload?.length) return null;

  const rows = [...payload].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        borderRadius: 2,
        minWidth: 220,
        bgcolor: "rgba(15,17,40,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}
      >
        ⏱ {label}
      </Typography>
      <Stack spacing={0.6} sx={{ mt: 0.6 }}>
        {rows.map((p) => {
          const key = p.dataKey; // e.g. "song_52"
          const songMeta = metadata?.[key] || {};
          // Defensive check for artists - it might be a string from the API
          const artistText = Array.isArray(songMeta.artists)
            ? songMeta.artists.map(a => a.name).join(', ')
            : songMeta.artists || '';

          return (
            <Stack key={key} direction="row" spacing={1} alignItems="center">
              {songMeta.cover ? (
                <Avatar
                  src={songMeta.cover}
                  sx={{ width: 22, height: 22, borderRadius: 1 }}
                />
              ) : null}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  flex: 1,
                  fontSize: 12,
                  color: "#fff",
                }}
                noWrap
              >
                {songMeta.title || key} - {artistText}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}
              >
                {p.value ?? 0}%
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}


const ZING_LINE_COLORS = {
  1: "#58b3ff", // xanh dương sáng Top 1
  2: "#ff4b6e", // đỏ/hồng sáng Top 2
  3: "#3cd67b", // xanh lá sáng Top 3
  default: "rgba(255,255,255,0.5)", // line khác: trắng mờ
};

export default function StyledZingChart({ chartDataset, lineChartMetadata }) {
  const [hoverLabel, setHoverLabel] = useState(null);

  const lineKeys = useMemo(
    () => (lineChartMetadata ? Object.keys(lineChartMetadata) : []),
    [lineChartMetadata]
  );

  const sortedLineKeys = useMemo(() => {
    if (!lineChartMetadata) return lineKeys;
    return [...lineKeys].sort((a, b) => {
      const ra = lineChartMetadata[a]?.rank ?? 999;
      const rb = lineChartMetadata[b]?.rank ?? 999;
      return ra - rb;
    });
  }, [lineKeys, lineChartMetadata]);

  if (!chartDataset || chartDataset.length === 0) {
      return (
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Không có dữ liệu để vẽ biểu đồ.</Typography>
        </Box>
      );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartDataset}
        margin={{ left: 8, right: 24, top: 10, bottom: 10 }}
        onMouseMove={(state) => {
          if (state && state.activeLabel) {
            setHoverLabel(state.activeLabel);
          }
        }}
        onMouseLeave={() => setHoverLabel(null)}
      >
        <defs>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {hoverLabel && (
          <ReferenceLine
            x={hoverLabel}
            stroke="#ff4b5c"
            strokeWidth={1.5}
            strokeDasharray="2 2"
          />
        )}

        <CartesianGrid
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="2 6"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12, fill: "rgba(255,255,255,0.65)" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "rgba(255,255,255,0.65)" }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
          unit="%"
          domain={[0, 100]}
        />

        <ReTooltip content={<SongTooltip metadata={lineChartMetadata} />} />

        {sortedLineKeys.map((key, index) => {
          const songMeta = lineChartMetadata?.[key] || {};
          const effectiveRank = songMeta.rank ?? index + 1;
          const baseColor =
            ZING_LINE_COLORS[effectiveRank] || ZING_LINE_COLORS.default;
          const color =
            effectiveRank === 1
              ? baseColor
              : effectiveRank === 2
              ? "rgba(255,75,110,0.9)"
              : effectiveRank === 3
              ? "rgba(60,214,123,0.9)"
              : baseColor;
          const isTop1 = effectiveRank === 1;
          const filterId =
            effectiveRank === 1
              ? "url(#glow-blue)"
              : effectiveRank === 2
              ? "url(#glow-pink)"
              : effectiveRank === 3
              ? "url(#glow-green)"
              : undefined;

          return (
            <Line
              key={key}
              name={`${songMeta.title || key} - ${
                Array.isArray(songMeta.artists) ? songMeta.artists.map(a => a.name).join(', ') : songMeta.artists || ''
              }`}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={isTop1 ? 3 : 2}
              strokeLinecap="round"
              filter={filterId}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: color,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#ffffff",
                stroke: color,
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
