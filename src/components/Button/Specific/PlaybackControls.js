import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import RepeatRounded from "@mui/icons-material/RepeatRounded";
import RepeatOneRounded from "@mui/icons-material/RepeatOneRounded";

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

  // icon style
  const iconSx = (active = false) => (t) => ({
    color: active ? t.palette.primary.main : t.palette.text.primary,
    transition: "all .22s ease",
    transform: active ? "scale(1.08)" : "scale(1)",
    filter: active ? "drop-shadow(0 0 6px rgba(0,150,255,0.35))" : "none",

    "&:hover": {
      color: t.palette.primary.light,
      transform: "scale(1.15)",
    },
    "&:active": {
      transform: "scale(0.92)",
    },
  });

  // play/pause gradient button
  const playBtnSx = (t) => ({
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
    color: "#fff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .22s ease",

    "&:hover": {
      transform: "scale(1.12)",
      boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
    },
    "&:active": { transform: "scale(0.95)" },
  });

  const repeatTooltip =
    repeatMode === "one"
      ? "Lặp 1 bài (bấm để chuyển: Lặp tất cả)"
      : repeatMode === "all"
      ? "Lặp tất cả (bấm để chuyển: Không lặp)"
      : "Không lặp (bấm để chuyển: Lặp 1 bài)";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.8,
        px: 1,
        userSelect: "none",
      }}
    >
      {/* SHUFFLE */}
      <Tooltip title={isShuffleActive ? "Đang bật xáo trộn" : "Bật xáo trộn"}>
        <IconButton
          aria-label="shuffle"
          aria-pressed={isShuffleActive}
          onClick={(e) => {
            e.stopPropagation();
            handleShuffle();
          }}
          sx={iconSx(isShuffleActive)}
        >
          <ShuffleRounded />
        </IconButton>
      </Tooltip>

      {/* PREVIOUS */}
      <IconButton
        aria-label="previous"
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
        sx={iconSx(false)}
      >
        <SkipPreviousRounded />
      </IconButton>

      {/* PLAY / PAUSE WAVES */}
      <IconButton
        aria-label={isPlaying ? "pause" : "play"}
        onClick={(e) => {
          e.stopPropagation();
          handlePlayPause();
        }}
        sx={playBtnSx}
      >
        <WaveIcon isPlaying={isPlaying} />
      </IconButton>

      {/* NEXT */}
      <IconButton
        aria-label="next"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        sx={iconSx(false)}
      >
        <SkipNextRounded />
      </IconButton>

      {/* REPEAT */}
      <Tooltip title={repeatTooltip}>
        <IconButton
          aria-label="repeat"
          aria-pressed={repeatActive}
          onClick={(e) => {
            e.stopPropagation();
            handleRepeat();
          }}
          sx={iconSx(repeatActive)}
        >
          <RepeatIconUI />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/* ----------------- WAVES ICON ----------------- */

function WaveIcon({ isPlaying }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        height: "22px",
        width: "26px",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          sx={{
            width: "4px",
            backgroundColor: "white",
            borderRadius: "3px",
            height: isPlaying ? "100%" : "6px",
            animation: isPlaying
              ? `waveAnim 0.6s ease-in-out ${i * 0.12}s infinite`
              : "none",

            "@keyframes waveAnim": {
              "0%": { height: "25%" },
              "50%": { height: "100%" },
              "100%": { height: "25%" },
            },
          }}
        />
      ))}
    </Box>
  );
}
