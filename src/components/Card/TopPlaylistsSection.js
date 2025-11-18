// src/components/Section/TopPlaylistsSection.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { getTopPlaylists, getNewReleasePlaylists, getMostLikedPlaylists } from '../../services/playlistService';

import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

export default function TopPlaylistsSection() {
  const [playlists, setPlaylists] = useState([]);
  const [sortBy, setSortBy] = useState('listens'); // 'listens' is the default
  const [loading, setLoading] = useState(true);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState(null);

  const { loadQueue, normalizeArtists } = useMediaPlayer();
  const theme = useTheme();
  const headerColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  // ============================
  // Fetch playlists based on sort option
  // ============================
  useEffect(() => {
    const ac = new AbortController();

    async function fetchPlaylists() {
      setLoading(true);
      try {
        let fetched;
        const limit = 15; // Fetch a reasonable number for the carousel

        switch (sortBy) {
          case 'newest':
            fetched = await getNewReleasePlaylists(limit, ac.signal);
            break;
          case 'likes':
            fetched = await getMostLikedPlaylists(limit, ac.signal);
            break;
          case 'listens':
          default:
            fetched = await getTopPlaylists(limit, ac.signal);
            break;
        }

        const playlistsData = Array.isArray(fetched) ? fetched : [];
        setPlaylists(playlistsData);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(`Error fetching playlists for sort by ${sortBy}:`, err);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylists();
    return () => ac.abort();
  }, [sortBy]); // Re-fetch when sortBy changes


  // ==========================================
  // ⭐ Play playlist — hỗ trợ Next / Prev
  // ==========================================
  const handlePlayPlaylist = async (playlist) => {
    if (!playlist || !playlist.id) return;
    setLoadingPlaylistId(playlist.id);
    try {
      // 1. Fetch the full playlist details to get song IDs
      const fullPlaylist = await getPlaylistById(playlist.id);
      const songIds = fullPlaylist.songs;

      if (!songIds || songIds.length === 0) {
        console.warn("Playlist has no songs:", fullPlaylist);
        return;
      }

      // 2. Fetch full song objects from IDs
      const songResults = await Promise.allSettled(
        songIds.map(id => getSongById(id))
      );
      
      const fetchedSongs = songResults
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value);

      if (fetchedSongs.length === 0) {
        console.warn("Could not fetch any songs for the playlist");
        return;
      }
      
      // 3. Normalize and load queue
      const normalizedSongs = fetchedSongs.map((song, index) => ({
        id: song.id ?? index,
        title: song.title,
        mediaSrc: song.mediaSrc || song.audioUrl,
        imageUrl: song.imageUrl,
        artists: normalizeArtists(song.artists)
      }));

      loadQueue(normalizedSongs, 0);

    } catch (error) {
      console.error("Failed to play playlist:", error);
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ color: headerColor }}>
          Danh sách playlist
        </Typography>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
          sx={{
            height: 40,
            backgroundColor: 'background.paper',
            color: 'text.primary'
          }}
        >
          <MenuItem value="listens">Lượt nghe</MenuItem>
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="likes">Lượt thích</MenuItem>
        </Select>
      </Box>

      {/* Nội dung */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 130 }}>
          <CircularProgress />
        </Box>
      ) : playlists.length > 0 ? (
        <PlaylistCarousel
          key={sortBy}          // ép remount khi đổi sort
          playlists={playlists}
          columns={3}
          // Khi bấm play playlist → nạp queue + Next/Prev OK
          onPlay={handlePlayPlaylist}
          loadingPlaylistId={loadingPlaylistId}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 130
          }}
        >
          <Typography color="text.secondary">
            Không tìm thấy playlist nào.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
