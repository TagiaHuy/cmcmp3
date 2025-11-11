// src/components/Section/TopPlaylistsSection.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getTopPlaylists } from '../../services/playlistService';
import PlaylistCarousel from '../Carousel/PlaylistCarousel';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

export default function TopPlaylistsSection() {
  const [rawPlaylists, setRawPlaylists] = useState([]);
  const [sortBy, setSortBy] = useState('listens'); // 'listens' | 'releaseDate' | 'likes'
  const { handlePlay, loadQueue } = useMediaPlayer(); // Import loadQueue
  const theme = useTheme();
  const headerColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

  const n = (v) => (typeof v === 'number' ? v : Number(v ?? 0));
  const ts = (d) => {
    if (!d) return 0;
    if (typeof d === 'string') return new Date(d.replace(' ', 'T')).getTime() || 0;
    if (Array.isArray(d)) {
      const [y, m = 1, day = 1, hh = 0, mm = 0, ss = 0] = d;
      return new Date(y, m - 1, day, hh, mm, ss).getTime() || 0;
    }
    return new Date(d).getTime() || 0;
  };

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const data = await getTopPlaylists(50, ac.signal); // lấy dư 1 chút cho sort
        setRawPlaylists(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== 'AbortError') setRawPlaylists([]);
      }
    })();
    return () => ac.abort();
  }, []);

  // Chuẩn hóa để sort
  const normalized = useMemo(
    () =>
      rawPlaylists.map((p) => ({
        ...p,
        _listen: n(p.listenCount ?? p.listen_count),
        _likes: n(p.likeCount ?? p.like_count),
        _created: ts(p.createdAt ?? p.created_at),
      })),
    [rawPlaylists]
  );

  // Sort giảm dần + tie-break để đảm bảo thay đổi thứ tự
  const sorted = useMemo(() => {
    const arr = [...normalized];
    if (sortBy === 'releaseDate') {
      arr.sort((a, b) =>
        b._created - a._created ||
        b._listen - a._listen ||
        b._likes - a._likes
      );
    } else if (sortBy === 'likes') {
      arr.sort((a, b) =>
        b._likes - a._likes ||
        b._listen - a._listen ||
        b._created - a._created
      );
    } else {
      // listens (mặc định)
      arr.sort((a, b) =>
        b._listen - a._listen ||
        b._likes - a._likes ||
        b._created - a._created
      );
    }
    return arr;
  }, [normalized, sortBy]);

  const handlePlayPlaylist = (playlist) => {
    if (!Array.isArray(playlist?.songs) || playlist.songs.length === 0) return;
    loadQueue(playlist.songs, 0); // Load entire playlist and start from the first song
  };

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
          <MenuItem value="releaseDate">Phát hành</MenuItem>
          <MenuItem value="likes">Lượt thích</MenuItem>
        </Select>
      </Box>

      {sorted.length > 0 ? (
        // ép carousel remount khi đổi sort để cập nhật thứ tự
        <PlaylistCarousel key={sortBy} playlists={sorted} onPlay={handlePlayPlaylist} columns={3} />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 130 }}>
          <Typography color="text.secondary">Đang chờ dữ liệu từ backend...</Typography>
        </Box>
      )}
    </Box>
  );
}
