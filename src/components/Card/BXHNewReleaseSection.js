// npm install @mui/icons-material

import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import BasePlayableImage from "./Base/BasePlayableImage";
import { useMediaPlayer } from "../../context/MediaPlayerContext";

function BXHCard({ item, onPlay, onFavorite }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePlay = () => {
    onPlay?.({
      title: item.title,
      artists: item.artists,
      imageUrl: item.cover,
      mediaSrc: item.mediaSrc,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1,
        borderRadius: 2,
        transition: "background-color 0.2s",
        backgroundColor: "rgba(255,255,255,0.08)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hình + nút Play */}
      <Box
        sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}
        onClick={handlePlay}
      >
        <BasePlayableImage
          mediaSrc={item.mediaSrc}
          onPlay={handlePlay}
          size={120}
          isHovered={isHovered}
        >
          <img
            src={item.cover}
            alt={item.title}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              display: "block",
            }}
          />
        </BasePlayableImage>

      </Box>

      {/* Thông tin */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            color: "text.primary",
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.artists}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            #{item.order}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {item.releaseDate}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}

export default function BXHNewReleaseSection({ dataBXH = [] }) {const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const linkColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const { handlePlay, addToLibrary } = useMediaPlayer();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const playViaContextOrFallback = (payload) => {
    if (typeof handlePlay === "function") {
      return handlePlay({
        title: payload.title,
        artists: payload.artists,
        imageUrl: payload.imageUrl,
        audioUrl: payload.mediaSrc,
        mediaSrc: payload.mediaSrc,
      });
    }

    if (payload?.mediaSrc) {
      if (!window.__audioSingleton) {
        window.__audioSingleton = new Audio();
        window.__audioSingleton.preload = "auto";
      }
      const audio = window.__audioSingleton;
      audio.pause();
      audio.src = payload.mediaSrc;
      audio.load();
      audio.play().catch((e) => console.warn("Không phát được audio:", e));
    } else {
      console.warn("Thiếu mediaSrc:", payload);
    }
  };

  const favoriteViaContextOrLocal = (item) => {
    if (typeof addToLibrary === "function") return addToLibrary(item);
    try {
      const key = "favorites";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      if (!list.find((x) => x.id === item.id)) {
        list.push({ id: item.id, title: item.title, cover: item.cover });
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch (e) {
      console.warn("Lỗi lưu favorites local:", e);
    }
  };

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11, position: "relative" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: headerColor }}
        >
          BXH Nhạc Mới
        </Typography>
        <Link
          to="/moi-phat-hanh"
          style={{
            textDecoration: "none",
            fontSize: "0.9rem",
            opacity: 0.85,
            color: linkColor,
          }}
        >
          TẤT CẢ
        </Link>
      </Box>

      {/* Carousel (cuộn ngang có nút) */}
      <Box sx={{ position: "relative" }}>
        {/* Nút trái */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            left: -30,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Danh sách cuộn */}
        <Box
        ref={scrollRef}
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
            maxWidth: "100%",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "max-content",
              pb: 1,
            }}
          >
            {dataBXH.map((item) => (
              <Box key={item.id} sx={{ flex: "0 0 auto", width: 250 }}>
                <BXHCard
                  item={item}
                  onPlay={playViaContextOrFallback}
                  onFavorite={favoriteViaContextOrLocal}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Nút phải */}
        <IconButton
          onClick={scrollRight}
          sx={{
            position: "absolute",
            right: -30,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}