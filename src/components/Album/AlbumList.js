import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { getAlbumById } from '../../services/albumService'; // Assuming getAlbumById exists
import AlbumListItem from './AlbumListItem';

/** Presentational – chỉ render danh sách */
const AlbumListRenderer = ({ albums, onPlay, onOpen }) => {
  if (!albums || albums.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
        Danh sách này hiện chưa có album nào.
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {albums.map((al, index) => (
        <AlbumListItem
          key={al.id}
          album={al}
          index={index}
          onPlay={() => onPlay?.(al)}
          onOpen={onOpen}
        />
      ))}
    </List>
  );
};

/**
 * Smart component – quyết định fetch hay dùng props (KHÔNG dùng hook riêng)
 * props:
 *  - albumIds?: string[]
 *  - albums?: AlbumDTO[]
 *  - onOpen?: (al) => void
 */
export default function AlbumList({ albumIds, albums: albumsFromProps, onOpen }) {
  const { handlePlay } = useMediaPlayer(); // nếu bạn có playAlbum thì thay bằng nó
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [fetchedAlbums, setFetchedAlbums] = useState([]);

  // Chuẩn hóa ids
  const normalizedIds = useMemo(
    () => (Array.isArray(albumIds) ? albumIds.filter(Boolean) : []),
    [albumIds]
  );

  // Fetch trực tiếp khi không nhận albums qua props
  useEffect(() => {
    if (albumsFromProps) {
      // Có sẵn data → không fetch
      setFetchedAlbums([]);
      setLoading(false);
      setError(null);
      return;
    }
    if (!normalizedIds.length) {
      setFetchedAlbums([]);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming getAlbumById exists in albumService.js
        const results = await Promise.all(
          normalizedIds.map(id => getAlbumById(id, ac.signal).catch(() => null))
        );
        setFetchedAlbums(results.filter(Boolean));
      } catch (e) {
        if (e?.name !== 'AbortError') setError(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [normalizedIds, albumsFromProps]);

  const albumsToRender = albumsFromProps || fetchedAlbums;

  // Loading/error chỉ áp dụng khi đang fetch
  if (!albumsFromProps) {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Typography color="error" sx={{ textAlign: 'center', py: 5 }}>
          Không thể tải danh sách album.
        </Typography>
      );
    }
  }

  // Phát album: mặc định phát bài đầu tiên (tuỳ bạn thay bằng playAlbum)
  const handlePlayAlbum = (al) => {
    const firstSong = Array.isArray(al?.songs) ? al.songs[0] : null;
    if (!firstSong) return;
    // Nếu songs là mảng song object → truyền thẳng
    // Nếu songs là mảng id → bạn cần map/id->song trước khi handlePlay
    handlePlay(firstSong);
  };

  return (
    <AlbumListRenderer
      albums={albumsToRender}
      onPlay={handlePlayAlbum}
      onOpen={onOpen}
    />
  );
}
