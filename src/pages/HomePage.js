import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import usePlaylists from "../hooks/usePlaylists";
import ZingChartSection from "../components/Chart/ZingChartSection";
import TopPlaylistsSection from "../components/Card/TopPlaylistsSection";
import TopSongsSection from "../components/Card/TopSongsSection";
import RecommendationSection from "../components/Card/RecommendationSection";
import PlaylistView from "../components/Card/PlaylistView";
import Top100Section from "../components/Card/Top100Section";
import BXHNewReleaseSection from "../components/Card/BXHNewReleaseSection";
import RecentlyPlayed from "../components/Card/RecentlyPlayed";
import Footer from "../layout/Footer";

// ✅ NEW: album public cho HomePage
import HomeAlbumList from "../components/Album/HomeAlbumList";
import { getHomepageAlbums } from "../services/albumService";

const HomePage = () => {
  const { playlists, loading, error } = usePlaylists();

  // ✅ NEW: state cho albums public
  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [albumsError, setAlbumsError] = useState(null);

  const l1 = playlists.find((p) => p.id === "l1");
  const l2 = playlists.find((p) => p.id === "l2");
  const l3 = playlists.find((p) => p.id === "l3");
  const l4 = playlists.find((p) => p.id === "l4");

  // ✅ NEW: fetch albums public cho trang chủ
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setAlbumsLoading(true);
        setAlbumsError(null);

        // type: "new" | "liked" | "play" | "all"
        const data = await getHomepageAlbums({ type: "new", limit: 10 }, ac.signal);
        setAlbums(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== "AbortError") setAlbumsError(e);
      } finally {
        setAlbumsLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching songs.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <TopPlaylistsSection />
      <TopSongsSection />
      <RecommendationSection />

      {/* ✅ Album nổi bật (public ai cũng thấy) */}
      <Box sx={{ my: 5, ml: 11, mr: 11 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ color: "text.primary", fontWeight: "bold" }}
        >
          Album nổi bật
        </Typography>

        {albumsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : albumsError ? (
          <Typography color="error" sx={{ mt: 2 }}>
            Lỗi tải album: {albumsError.message}
          </Typography>
        ) : (
          <HomeAlbumList albums={albums} />
        )}
      </Box>

      <RecentlyPlayed />

      <Top100Section />
      <BXHNewReleaseSection />

      <PlaylistView playlist={l1} banners={playlists.map((p) => ({ ...p, title: p.name }))} />
      <PlaylistView playlist={l2} />
      <PlaylistView playlist={l3} />
      <PlaylistView playlist={l4} />

      <ZingChartSection />
      <Footer />
    </Box>
  );
};

export default HomePage;
