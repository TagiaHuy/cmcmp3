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
import { useMediaPlayer } from "../../context/MediaPlayerContext";

export default function TopSongsSection() {
  const [topSongs, setTopSongs] = useState([]);
  const [sortBy, setSortBy] = useState("listens"); // 'listens', 'newest', 'likes'
  const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  const { loadQueue, normalizeArtists } = useMediaPlayer();

  // Fetch dữ liệu theo sort
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

  // ⭐ Hàm play 1 bài trong danh sách — hỗ trợ Next / Prev
  const handlePlaySong = (clickedSong) => {
    if (!clickedSong || !Array.isArray(topSongs) || topSongs.length === 0) {
      return;
    }

    // Chuẩn hoá toàn bộ list → queue
    const normalizedSongs = topSongs.map((song, index) => ({
      id: song.id ?? index,
      title: song.title,
      mediaSrc: song.mediaSrc || song.audioUrl,
      imageUrl: song.imageUrl,
      artists: normalizeArtists?.(song.artists) ?? song.artists,
      duration: song.duration,
      source: "topsongs",
    }));

    // Tìm index bài click (dựa cả id và mediaSrc cho chắc)
    let startIndex = normalizedSongs.findIndex(
      (s) =>
        (clickedSong.id && s.id === clickedSong.id) ||
        (clickedSong.mediaSrc && s.mediaSrc === clickedSong.mediaSrc)
    );
    if (startIndex < 0) startIndex = 0;

    // Nạp queue + set bài đang phát
    loadQueue(normalizedSongs, startIndex);
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
          }}
        >
          <MenuItem value="listens">Lượt nghe</MenuItem>
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="likes">Lượt thích</MenuItem>
        </Select>
      </Box>

      {/* Song Carousel */}
      {topSongs.length > 0 ? (
        <SongCarousel
          songs={topSongs}
          columns={3}
          onPlay={handlePlaySong}   // 🔥 Quan trọng: truyền callback xuống
        />
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
