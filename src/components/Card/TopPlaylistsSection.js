// src/components/Section/TopPlaylistsSection.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  getTopPlaylists,
  getNewestPlaylists,
  getPlaylistsByTopLikes
} from '../../services/playlistService';

import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

export default function TopPlaylistsSection() {
  const [playlists, setPlaylists] = useState([]);
  const [sortBy, setSortBy] = useState('listens');

  const {
    loadQueue,
    handlePlay,
    playPlaylistRandom,
    normalizeArtists
  } = useMediaPlayer();

  const theme = useTheme();
  const headerColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  // ============================
  // Fetch playlist theo sort type
  // ============================
  useEffect(() => {
    const ac = new AbortController();

    async function fetchPlaylists() {
      try {
        let fetched = [];

        if (sortBy === 'listens') {
          fetched = await getTopPlaylists(8, ac.signal);
        } else if (sortBy === 'newest') {
          fetched = await getNewestPlaylists(8, ac.signal);
        } else if (sortBy === 'likes') {
          fetched = await getPlaylistsByTopLikes(8, ac.signal);
        }

        setPlaylists(Array.isArray(fetched) ? fetched : []);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
        setPlaylists([]);
      }
    }

    fetchPlaylists();
    return () => ac.abort();
  }, [sortBy]);

  // ==========================================
  // ⭐ Hàm play playlist (track đầu hoặc random)
  // ==========================================
  const handlePlayPlaylist = (playlist) => {
    if (!playlist) return;

    const songs = playlist.songs || playlist.trackList || [];

    if (!Array.isArray(songs) || songs.length === 0) {
      console.warn("Playlist không có bài hát:", playlist);
      return;
    }

    // Chuẩn hóa track list
    const normalizedSongs = songs.map((song) => ({
      id: song.id,
      title: song.title,
      mediaSrc: song.mediaSrc || song.audioUrl,
      imageUrl: song.imageUrl,
      artists: normalizeArtists(song.artists)
    }));

    // Play track đầu tiên
    loadQueue(normalizedSongs, 0);
    handlePlay(normalizedSongs[0]);
  };

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', mb: 2
      }}>
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
      {playlists.length > 0 ? (
        <PlaylistCarousel
          key={sortBy} // ép remount khi đổi sort
          playlists={playlists}
          columns={3}
          onPlay={handlePlayPlaylist}  // ⭐ TRUYỀN ĐÚNG CALLBACK PLAY PLAYLIST
        />
      ) : (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 130
        }}>
          <Typography color="text.secondary">
            Đang chờ dữ liệu từ backend...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
