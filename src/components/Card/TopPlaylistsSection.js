// src/components/Section/TopPlaylistsSection.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getTopPlaylists, getNewestPlaylists } from '../../services/playlistService';
import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

export default function TopPlaylistsSection() {
  const [playlists, setPlaylists] = useState([]);
  const [sortBy, setSortBy] = useState('listens');
  const { handlePlay } = useMediaPlayer();
  const theme = useTheme();
  const headerColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  useEffect(() => {
    const ac = new AbortController();
    const fetchPlaylists = async () => {
      let fetchedPlaylists = [];
      try {
        if (sortBy === 'listens') {
          fetchedPlaylists = await getTopPlaylists(8, ac.signal);
        } else if (sortBy === 'newest') {
          fetchedPlaylists = await getNewestPlaylists(8, ac.signal);
        }
        setPlaylists(Array.isArray(fetchedPlaylists) ? fetchedPlaylists : []);
      } catch (e) {
        if (e?.name !== 'AbortError') {
          console.error("Error fetching playlists:", e);
          setPlaylists([]);
        }
      }
    };

    fetchPlaylists();
    return () => ac.abort();
  }, [sortBy]);

  return (
    <Box sx={{ my: 5, ml: 11, mr: 11 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: headerColor }}>
          Danh sách playlist
        </Typography>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
          sx={{
            height: 40,
            color: 'text.primary',
            backgroundColor: 'background.paper',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
            '.MuiSvgIcon-root': { color: 'text.primary' },
          }}
        >
          <MenuItem value="listens">Lượt nghe</MenuItem>
          <MenuItem value="newest">Mới nhất</MenuItem>
        </Select>
      </Box>

      {playlists.length > 0 ? (
        // ép carousel remount khi đổi sort để cập nhật thứ tự
        <PlaylistCarousel key={sortBy} playlists={playlists} onPlay={handlePlay} columns={3} />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 130 }}>
          <Typography color="text.secondary">Đang chờ dữ liệu từ backend...</Typography>
        </Box>
      )}
    </Box>
  );
}
