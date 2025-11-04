import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// Icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// NOTE: file này ở: src/components/Card/Top100Section.js
import top100Img from "../../assets/top100.png";
import top100ImgVpop from "../../assets/top100-vpop.png";
import top100ImgQuehuong from "../../assets/top100-que-huong.png";
import top100ImgNhacTre from "../../assets/top100-nhac-tre.png";
import top100ImgPopUSUK from "../../assets/top100-pop-usuk.png";

const dataTop100 = [
  {
    id: "top100-tru-tinh",
    title: "Top 100 Nhạc Trữ Tình Hay Nhất",
    subtitle: "Quỳnh Trang, Dương Hồng Loan, Mạnh Quỳnh…",
    cover: top100Img,
  },
  {
    id: "top100-vpop",
    title: "Top 100 Nhạc V-Pop Hay Nhất",
    subtitle: "Dương Domic, Quang Hùng MasterD, Tăng Duy Tân…",
    cover: top100ImgVpop,
  },
  {
    id: "top100-que-huong",
    title: "Top 100 Nhạc Quê Hương Hay Nhất",
    subtitle: "Dương Hồng Loan, Hà Vân, Phi Nhung…",
    cover: top100ImgQuehuong,
  },
  {
    id: "top100-nhac-tre",
    title: "Top 100 Bài Hát Nhạc Trẻ Hay Nhất",
    subtitle: "Quang Hùng MasterD, Tăng Duy Tân, Tùng Dương…",
    cover: top100ImgNhacTre,
  },
  {
    id: "top100-pop-usuk",
    title: "Top 100 Pop Âu Mỹ Hay Nhất",
    subtitle: "Taylor Swift, Sabrina Carpenter, Lady Gaga…",
    cover: top100ImgPopUSUK,
  },
];

export default function Top100Section() {
  const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const linkColor = theme.palette.mode === "dark" ? "#fff" : "#000";

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

      {/* Grid */}
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
          <Box key={item.id} sx={{ cursor: "pointer" }}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                transition: "transform .25s",
                "&:hover": { transform: "translateY(-3px)" }
              }}
            >
              {/* Ảnh */}
              <Box
                component="img"
                src={item.cover}
                alt={item.title}
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: 2,
                  display: "block",
                }}
              />

              {/* Overlay + Buttons */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  opacity: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  transition: "opacity .25s",
                  "&:hover": { opacity: 1 },
                }}
              >
                {/* ❤️ */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(255,255,255,.25)",
                    "&:hover": { bgcolor: "rgba(255,255,255,.4)" },
                  }}
                  onClick={() => console.log("THÊM VÀO THƯ VIỆN:", item.id)}
                >
                  <FavoriteBorderIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>

                {/* ▶ */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "white",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() => console.log("PHÁT NHẠC:", item.id)}
                >
                  <PlayArrowIcon sx={{ color: "black", fontSize: 32 }} />
                </Box>

                {/* ⋯ */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(255,255,255,.25)",
                    "&:hover": { bgcolor: "rgba(255,255,255,.4)" },
                  }}
                  onClick={() => console.log("MENU KHÁC:", item.id)}
                >
                  <MoreHorizIcon sx={{ color: "white", fontSize: 22 }} />
                </Box>
              </Box>
            </Box>

            {/* Text */}
            <Box sx={{ px: 1, py: 1.25 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: "text.primary", lineHeight: 1.25 }}>
                {item.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {item.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
