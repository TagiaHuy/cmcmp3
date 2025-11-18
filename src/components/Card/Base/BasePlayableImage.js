// src/components/Card/Base/BasePlayableImage.jsx
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const PLAY_BUTTON_DIAMETER = 42; // px

const BasePlayableImage = ({
  children,
  onPlay,
  mediaSrc,
  size = 130,
  borderRadius = "8px",
  sx,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  hidePlayButtonBorder = false,
  isLoading = false,
}) => {

  // ⭐ BasePlayableImage KHÔNG format data — chỉ gọi play
  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) onPlay();
  };

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: "relative",
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        ...sx,
      }}
    >
      {/* Ảnh con */}
      {children}

      {/* Overlay mờ khi hover */}
      {(isHovered || isLoading) && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.40)",
            zIndex: 2,
          }}
        />
      )}

      {/* Nút ▶ hoặc Loading Spinner */}
      {(isHovered || isLoading) && (
        <Box
          onClick={isLoading ? undefined : handlePlayClick}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: PLAY_BUTTON_DIAMETER,
            height: PLAY_BUTTON_DIAMETER,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            cursor: isLoading ? "default" : "pointer",

            background: "rgba(255,255,255,0.08)",
            border: hidePlayButtonBorder
              ? "none"
              : "3px solid rgba(255,255,255,0.95)",

            transition: "transform .18s ease",
            zIndex: 3,
            "&:hover": { 
              transform: isLoading ? "translate(-50%,-50%)" : "translate(-50%,-50%) scale(1.09)" 
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={28} sx={{ color: '#fff' }} />
          ) : (
            <PlayArrowIcon sx={{ color: "#fff", fontSize: 28, ml: 0.4 }} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default BasePlayableImage;
