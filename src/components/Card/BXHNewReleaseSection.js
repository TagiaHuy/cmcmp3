import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import BasePlayableImage from "./Base/BasePlayableImage";
import FavoriteButton from "../Button/Specific/FavoriteButton";
import MoreButton from "../Button/Specific/MoreButton";
import { useMediaPlayer } from "../../context/MediaPlayerContext";
import Amthambenem from "../../assets/Am-tham-ben-em.mp3";

const dataBXH = [
  {
    id: 1,
    title: "Người Đầu Tiên",
    artists: "Juky San, buitruonglinh",
    order: 1,
    releaseDate: "30.10.2025",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/6/8/c/9/68c95397051202625f2a0d5be7b4c009.jpg",
    mediaSrc: Amthambenem,
  },
  {
    id: 2,
    title: "Canh Bạc Hôn Nhân",
    artists: "LaLa Trần, Nguyễn Hồng Thuận",
    order: 2,
    releaseDate: "28.10.2025",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/1/f/0/0/1f0077a89edf602fad7d253344c3c5f6.jpg",
    mediaSrc: Amthambenem,
  },
  {
    id: 3,
    title: "Thiệp Hồng Sai Tên",
    artists: "Nguyễn Thành Đạt",
    order: 3,
    releaseDate: "30.10.2025",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/c/b/e/2/cbe2ceec5abeb23993f991d9d2e555fc.jpg",
    mediaSrc: Amthambenem,
  },
  {
    id: 4,
    title: "Hơn Là Bạn",
    artists: "Karik, MIN, Ngô Kiến Huy",
    order: 4,
    releaseDate: "03.11.2025",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/0/9/0/9/090961eb9662b984a71a2e479f400325.jpg",
    mediaSrc: Amthambenem,
  },
];

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
        "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
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

        {/* ❤️ ⋯ */}
        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              left: 6,
              display: "flex",
              gap: 1.5,
              zIndex: 2,
            }}
          >
            <FavoriteButton visible={true} onClick={() => onFavorite?.(item)} />
            <MoreButton visible={true} />
          </Box>
        )}
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

export default function BXHNewReleaseSection() {
  const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const linkColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  const { handlePlay, addToLibrary } = useMediaPlayer();

  // ✅ Giống Top100: hỗ trợ context và fallback
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

    // Fallback nếu context chưa có
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
      console.log("Đã thêm vào thư viện (local):", item.title);
    } catch (e) {
      console.warn("Lỗi lưu favorites local:", e);
    }
  };

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
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

      {/* Danh sách bài hát (cuộn ngang) */}
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
          maxWidth: "100%",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.3)"
                : "rgba(0,0,0,0.3)",
            borderRadius: 4,
          },
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
    </Box>
  );
}
