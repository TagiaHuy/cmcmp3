// src/components/Section/TopSongsSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Select, MenuItem, useMediaQuery } from "@mui/material";
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

  const is2033 = useMediaQuery('(min-width:2033px)');
  const is1644 = useMediaQuery('(min-width:1644px)');
  const is1265 = useMediaQuery('(min-width:1265px)');
  const is900 = useMediaQuery('(min-width:900px)');

  const displayConfig = useMemo(() => {
    if (is2033) return { columns: 4, rows: 1 };
    if (is1644) return { columns: 3, rows: 1 }; // Force 3 columns to prevent wrapping
    if (is1265) return { columns: 2, rows: 2 }; // The 2x2 grid
    if (is900) return { columns: 2, rows: 1 };
    return { columns: 1, rows: 1 };
  }, [is2033, is1644, is1265, is900]);


  // Fetch dữ liệu theo sort
  useEffect(() => {
    const ac = new AbortController();

    const fetchSongs = async () => {
      try {
        let songs = [];
        // Fetch more songs if we are displaying a 2x2 grid
        const limit = displayConfig.rows > 1 ? 12 : 9;

        if (sortBy === "listens") {
          songs = await getTopSongs(limit, ac.signal);
        } else if (sortBy === "newest") {
          songs = await getNewestSongs(limit, ac.signal);
        } else if (sortBy === "likes") {
          songs = await getSongsByLikes(limit, ac.signal);
        } else {
          songs = await getTopSongs(limit, ac.signal);
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
  }, [sortBy, displayConfig]); // Add displayConfig to dependency array

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // ⭐ Hàm play 1 bài trong danh sách — hỗ trợ Next / Prev
  const handlePlaySong = (clickedSong) => {
    if (!clickedSong || !Array.isArray(topSongs) || topSongs.length === 0) {
      return;
    }

    const normalizedSongs = topSongs.map((song, index) => ({
      id: song.id ?? index,
      title: song.title,
      mediaSrc: song.mediaSrc || song.audioUrl,
      imageUrl: song.imageUrl,
      artists: normalizeArtists?.(song.artists) ?? song.artists,
      duration: song.duration,
      source: "topsongs",
    }));

    let startIndex = normalizedSongs.findIndex(
      (s) =>
        (clickedSong.id && s.id === clickedSong.id) ||
        (clickedSong.mediaSrc && s.mediaSrc === clickedSong.mediaSrc)
    );
    if (startIndex < 0) startIndex = 0;

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
          columns={displayConfig.columns}
          rows={displayConfig.rows}
          onPlay={handlePlaySong}
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