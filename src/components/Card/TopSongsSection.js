// src/components/Section/TopSongsSection.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  getTopSongs,
  getNewestSongs,
  getSongsByLikes,
} from "../../services/songService";
import SongCarousel from "../Carousel/SongCarousel";

export default function TopSongsSection() {
  const [topSongs, setTopSongs] = useState([]);
  const [sortBy, setSortBy] = useState("listens"); // 'listens', 'newest', 'likes'
  const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  useEffect(() => {
    const ac = new AbortController();

    const fetchSongs = async () => {
      try {
        let songs = [];

        if (sortBy === "listens") {
          songs = await getTopSongs(9, ac.signal);
        } else if (sortBy === "newest") {
          songs = await getNewestSongs(9, ac.signal);
        } else if (sortBy === "likes") {
          songs = await getSongsByLikes(9, ac.signal);
        } else {
          songs = await getTopSongs(9, ac.signal);
        }

        setTopSongs(Array.isArray(songs) ? songs : []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Error fetching top songs:", err);
          setTopSongs([]);
        }
      }
    };

    fetchSongs();
    return () => ac.abort();
  }, [sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: headerColor }}
        >
          Danh sách bài hát
        </Typography>

        <Select
          value={sortBy}
          onChange={handleSortChange}
          variant="outlined"
          sx={{
            height: 40,
            color: "text.primary",
            backgroundColor: "background.paper",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            ".MuiSvgIcon-root": {
              color: "text.primary",
            },
          }}
        >
          <MenuItem value="listens">Lượt nghe</MenuItem>
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="likes">Lượt thích</MenuItem>
        </Select>
      </Box>

      {/* Song Carousel */}
      {topSongs.length > 0 ? (
        <SongCarousel songs={topSongs} columns={3} />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 130,
          }}
        >
          <Typography color="text.secondary">
            Đang chờ dữ liệu từ backend...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
