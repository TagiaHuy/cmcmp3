import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Select, MenuItem, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  getTopPlaylists,
  getNewReleasePlaylists,
  getMostLikedPlaylists,
  getPlaylistById,
} from '../../services/playlistService';

import { getSongById } from '../../services/songService';
import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';


export default function TopPlaylistsSection() {
  const [playlists, setPlaylists] = useState([]);
  const [sortBy, setSortBy] = useState('listens');
  const [loading, setLoading] = useState(true);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState(null);

  const { loadQueue, normalizeArtists, addRecentlyPlayedPlaylist } = useMediaPlayer();
  const theme = useTheme();
  const headerColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

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

  // ============================
  // Fetch playlists based on sort option
  // ============================
  useEffect(() => {
    const ac = new AbortController();

    async function fetchPlaylists() {
      setLoading(true);
      try {
        let fetched;
        const limit = 15;

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
  }, [sortBy]);


  // ==========================================
  // ⭐ Play playlist — hỗ trợ Next / Prev
  // ==========================================
  const handlePlayPlaylist = async (playlist) => {
    if (!playlist || !playlist.id) return;
    setLoadingPlaylistId(playlist.id);
    addRecentlyPlayedPlaylist(playlist);
    try {
      const fullPlaylist = await getPlaylistById(playlist.id);
      const songIds = fullPlaylist.songs;

      if (!songIds || songIds.length === 0) {
        console.warn("Playlist has no songs:", fullPlaylist);
        return;
      }

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
          key={sortBy}
          playlists={playlists}
          columns={displayConfig.columns}
          rows={displayConfig.rows}
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
