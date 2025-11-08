import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import RepeatRounded from "@mui/icons-material/RepeatRounded";
import RepeatOneRounded from "@mui/icons-material/RepeatOneRounded";

/**
 * Props:
 * - isPlaying: boolean
 * - repeatMode: 'none' | 'one' | 'all'
 * - isShuffleActive: boolean
 * - handlePlayPause, handlePrevious, handleNext, handleShuffle, handleRepeat: () => void
 */
export default function PlaybackControls({
  isPlaying,
  repeatMode = "none",
  isShuffleActive,
  handlePlayPause,
  handlePrevious,
  handleNext,
  handleShuffle,
  handleRepeat,
}) {
  const repeatActive = repeatMode !== "none";
  const RepeatIconUI = repeatMode === "one" ? RepeatOneRounded : RepeatRounded;

  // style cho nút icon thường & khi active
  const iconSx = (active = false) => (t) => ({
    color: active ? t.palette.primary.main : t.palette.text.primary,
    transition: "color .18s ease",
    "&:hover": {
      color: active ? t.palette.primary.light : t.palette.primary.main,
    },
    "&:focus-visible": {
      outline: `2px solid ${t.palette.primary.main}`,
      outlineOffset: 2,
      borderRadius: 8,
    },
  });

  // style riêng cho nút play/pause (tròn, có đổ bóng)
  const playBtnSx = (t) => ({
    width: 44,
    height: 44,
    borderRadius: "50%",
    boxShadow: t.shadows[3],
    "& .MuiSvgIcon-root": { fontSize: 26 },
    transition: "color .18s ease, transform .08s ease",
    "&:hover": { color: t.palette.primary.light },
    "&:active": { transform: "scale(0.97)" },
  });

  const repeatTooltip =
    repeatMode === "one"
      ? "Lặp 1 bài (bấm để chuyển: Lặp tất cả)"
      : repeatMode === "all"
      ? "Lặp tất cả (bấm để chuyển: Không lặp)"
      : "Không lặp (bấm để chuyển: Lặp 1 bài)";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Tooltip title={isShuffleActive ? "Đang bật xáo trộn (bấm để tắt)" : "Bật xáo trộn"}>
        <IconButton
          aria-label="shuffle"
          aria-pressed={isShuffleActive}
          onClick={(e) => { e.stopPropagation(); handleShuffle(); }}
          sx={iconSx(isShuffleActive)}
        >
          <ShuffleRounded />
        </IconButton>
      </Tooltip>

      <IconButton
        aria-label="previous"
        onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
        sx={iconSx(false)}
      >
        <SkipPreviousRounded />
      </IconButton>

      <IconButton
        aria-label={isPlaying ? "pause" : "play"}
        onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
        color="primary"
        sx={playBtnSx}
      >
        {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
      </IconButton>

      <IconButton
        aria-label="next"
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        sx={iconSx(false)}
      >
        <SkipNextRounded />
      </IconButton>

      <Tooltip title={repeatTooltip}>
        <IconButton
          aria-label="repeat"
          aria-pressed={repeatActive}
          onClick={(e) => { e.stopPropagation(); handleRepeat(); }}
          sx={iconSx(repeatActive)}
        >
          <RepeatIconUI />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
