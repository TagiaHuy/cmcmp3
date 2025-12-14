import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import usePlaylists from '../hooks/usePlaylists';
import ZingChartSection from '../components/Chart/ZingChartSection';
import TopPlaylistsSection from '../components/Card/TopPlaylistsSection';
import TopSongsSection from '../components/Card/TopSongsSection';
import RecommendationSection from '../components/Card/RecommendationSection';
import PlaylistView from '../components/Card/PlaylistView';
import Top100Section from '../components/Card/Top100Section';
import BXHNewReleaseSection from '../components/Card/BXHNewReleaseSection';
import RecentlyPlayed from '../components/Card/RecentlyPlayed';
import Footer from '../layout/Footer';
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
