import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, CircularProgress, List } from '@mui/material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { getPlaylistById } from '../../services/playlistService';
import { getSongsByIds } from '../../services/songService'; // Import getSongsByIds
import PlaylistListItem from './PlaylistListItem';

/** Presentational – chỉ render danh sách */
const PlaylistListRenderer = ({ playlists, onPlay, onOpen }) => {
  if (!playlists || playlists.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
        Danh sách này hiện chưa có playlist nào.
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {playlists.map((pl, index) => (
        <PlaylistListItem
          key={pl.id}
          playlist={pl}
          index={index}
          onPlay={() => {
            console.log('PlaylistListRenderer: Calling onPlay for playlist:', pl.id); // DEBUG
            onPlay?.(pl);
          }}
          onOpen={onOpen}
        />
      ))}
    </List>
  );
};

/**
 * Smart component – quyết định fetch hay dùng props (KHÔNG dùng hook riêng)
 * props:
 *  - playlistIds?: string[]
 *  - playlists?: PlaylistDTO[]
 *  - onOpen?: (pl) => void
 */
export default function PlaylistList({ playlistIds, playlists: playlistsFromProps, onOpen }) {
  const { handlePlay, loadQueue } = useMediaPlayer(); // if you have playPlaylist, replace it with that
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [fetchedPlaylists, setFetchedPlaylists] = useState([]);

  // Chuẩn hóa ids
  const normalizedIds = useMemo(
    () => (Array.isArray(playlistIds) ? playlistIds.filter(Boolean) : []),
    [playlistIds]
  );

  // Fetch trực tiếp khi không nhận playlists qua props
  useEffect(() => {
    if (playlistsFromProps) {
      // Có sẵn data → không fetch
      setFetchedPlaylists([]);
      setLoading(false);
      setError(null);
      return;
    }
    if (!normalizedIds.length) {
      setFetchedPlaylists([]);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(
          normalizedIds.map(id => getPlaylistById(id, ac.signal).catch(() => null))
        );
        setFetchedPlaylists(results.filter(Boolean));
      } catch (e) {
        if (e?.name !== 'AbortError') setError(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [normalizedIds, playlistsFromProps]);

  const playlistsToRender = playlistsFromProps || fetchedPlaylists;

  // Loading/error chỉ áp dụng khi đang fetch
  if (!playlistsFromProps) {
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
          Không thể tải danh sách playlist.
        </Typography>
      );
    }
  }

  // Phát playlist: mặc định phát bài đầu tiên (tuỳ bạn thay bằng playPlaylist)
  const handlePlayPlaylist = async (pl) => { // Make async
    if (!Array.isArray(pl?.songs) || pl.songs.length === 0) return;

    // Assuming pl.songs contains song IDs, fetch full song objects
    const firstSongItem = pl.songs[0];
    let songsToLoad = [];

    if (typeof firstSongItem === 'string') { // Assuming it's an array of IDs
      try {
        const fullSongs = await getSongsByIds(pl.songs);
        songsToLoad = fullSongs;
      } catch (error) {
        console.error("handlePlayPlaylist: Error fetching full songs for playlist:", error);
      }
    } else { // Assuming it's already an array of full song objects
      songsToLoad = pl.songs;
    }

    if (songsToLoad.length > 0) {
      loadQueue(songsToLoad, 0); // Load entire playlist and start from the first song
    }
  };

  return (
    <PlaylistListRenderer
      playlists={playlistsToRender}
      onPlay={handlePlayPlaylist}
      onOpen={onOpen}
    />
  );
}
