import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { getTopSongs } from "../../services/songService";
import SongCarousel from "../Carousel/SongCarousel"; // Import the new carousel

export default function TopSongsSection() {
  const [topSongs, setTopSongs] = useState([]);
  const theme = useTheme();
  const headerColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const linkColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  useEffect(() => {
    const fetchTopSongs = async () => {
      // Fetch 9 songs to have a multiple of 3
      const songs = await getTopSongs(9);
      setTopSongs(songs);
    };

    fetchTopSongs();
  }, []);

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: headerColor }}>
          Top Songs
        </Typography>
        <Link to="/songs" style={{ textDecoration: "none", fontSize: "0.9rem", opacity: 0.85, color: linkColor }}>
          TẤT CẢ
        </Link>
      </Box>

      {/* Song Carousel */}
      {topSongs.length > 0 && (
        <SongCarousel songs={topSongs} columns={3} />
      )}
    </Box>
  );
}

