import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// Components theo pattern RecommendCard
import BasePlayableImage from './Base/BasePlayableImage';
import FavoriteButton from "../Button/Specific/FavoriteButton";
import MoreButton from "../Button/Specific/MoreButton";

// Context player
import { useMediaPlayer } from "../../context/MediaPlayerContext";

// Assets
import top100Img from "../../assets/top100.png";
import top100ImgVpop from "../../assets/top100-vpop.png";
import top100ImgQuehuong from "../../assets/top100-que-huong.png";
import top100ImgNhacTre from "../../assets/top100-nhac-tre.png";
import top100ImgPopUSUK from "../../assets/top100-pop-usuk.png";
import sampleMusic from "../../assets/Sample.mp3"; 
import Amthambenem from "../../assets/Am-tham-ben-em.mp3";
import Khiphaiquendi from "../../assets/Khi-phai-quen-di.mp3";


// ==== DATA: dùng mediaSrc theo đúng RecommendCard ====
const dataTop100 = [
  { id: "top100-tru-tinh",  
    title: "Top 100 Nhạc Trữ Tình Hay Nhất",  
    subtitle: "Quỳnh Trang, Dương Hồng Loan, Mạnh Quỳnh…", 
    cover: top100Img, 
    mediaSrc: Amthambenem    
},
  { id: "top100-vpop",      
    title: "Top 100 Nhạc V-Pop Hay Nhất",     
    subtitle: "Dương Domic, Quang Hùng MasterD, Tăng Duy Tân…", 
    cover: top100ImgVpop, 
    mediaSrc: Amthambenem
},
  { id: "top100-que-huong", 
    title: "Top 100 Nhạc Quê Hương Hay Nhất", 
    subtitle: "Dương Hồng Loan, Hà Vân, Phi Nhung…", 
    cover: top100ImgQuehuong, 
    mediaSrc: Khiphaiquendi
},
  { id: "top100-nhac-tre",  
    title: "Top 100 Bài Hát Nhạc Trẻ Hay Nhất",
    subtitle: "Quang Hùng MasterD, Tăng Duy Tân, Tùng Dương…", 
    cover: top100ImgNhacTre, 
    mediaSrc: sampleMusic 
},
  { id: "top100-pop-usuk",  
    title: "Top 100 Pop Âu Mỹ Hay Nhất",       
    subtitle: "Taylor Swift, Sabrina Carpenter, Lady Gaga…", 
    cover: top100ImgPopUSUK, 
    mediaSrc: sampleMusic 
},
];

// ===== Card con (dùng useState theo từng item) =====
function Top100Card({ item, onPlay, onFavorite }) {
  const [isHovered, setIsHovered] = React.useState(false);

  // đường kính nút Play trong BasePlayableImage (điều chỉnh nếu bạn đổi size)
  const PLAY_DIAMETER = 54; // px

  const handlePlay = () =>
    onPlay?.({
      title: item.title,
      artists: item.subtitle,
      imageUrl: item.cover,
      mediaSrc: item.mediaSrc,
    });

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ cursor: "pointer" }}
    >
      {/* Thumb + nút Play ở giữa */}
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          transition: "transform .25s",
          "&:hover": { transform: "translateY(-3px)" },
        }}
        onClick={handlePlay}
      >
        <BasePlayableImage
          mediaSrc={item.mediaSrc}
          onPlay={handlePlay}
          size={200}
          isHovered={isHovered}
        >
          <img
            src={item.cover}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </BasePlayableImage>

        {/* ❤️  [khoảng trống bằng đường kính nút ▶]  ⋯  — canh giữa theo chiều ngang */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHovered ? 1 : 0,
            transition: "opacity .2s",
            pointerEvents: "none",     // tránh che click nút ▶
            zIndex: 3,                 // nổi trên ảnh nhưng không che play (vì pointerEvents: none)
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* ❤️ */}
            <Box
              onClick={(e) => { e.stopPropagation(); onFavorite?.(item); }}
              sx={{ pointerEvents: "auto" }}
            >
              <FavoriteButton visible={isHovered} />
            </Box>

            {/* spacer = đường kính nút play để 3 nút nằm trên 1 đường thẳng */}
            <Box sx={{ width: PLAY_DIAMETER, height: PLAY_DIAMETER, pointerEvents: "none" }} />

            {/* ⋯ */}
            <Box
              onClick={(e) => { e.stopPropagation(); console.log("More:", item.id); }}
              sx={{ pointerEvents: "auto" }}
            >
              <MoreButton visible={isHovered} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Meta */}
      <Box sx={{ px: 1, py: 1.25 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            color: "text.primary",
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.subtitle}
        </Typography>
      </Box>
    </Box>
  );
}


export default function Top100Section() {
  const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const linkColor   = theme.palette.mode === "dark" ? "#fff" : "#000";

  // Player context (chuẩn)
  const { handlePlay, addToLibrary } = useMediaPlayer();

  // Fallback phát nhạc nếu context chưa wired
  const playViaContextOrFallback = (payload) => {
    // Ưu tiên context
    if (typeof handlePlay === "function") {
      return handlePlay({
        title: payload.title,
        artists: payload.artists,
        imageUrl: payload.imageUrl,
        audioUrl: payload.mediaSrc, // map sang field audioUrl cho player hiện có
        mediaSrc: payload.mediaSrc,
      });
    }
    // Fallback: phát trực tiếp
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: headerColor }}>
          Top 100
        </Typography>
        <Link to="/top100" style={{ textDecoration: "none", fontSize: "0.9rem", opacity: 0.85, color: linkColor }}>
          TẤT CẢ
        </Link>
      </Box>

      {/* Grid 5 cột */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
        }}
      >
        {dataTop100.map((item) => (
          <Top100Card
            key={item.id}
            item={item}
            onPlay={playViaContextOrFallback}
            onFavorite={favoriteViaContextOrLocal}
          />
        ))}
      </Box>
    </Box>
  );
}
