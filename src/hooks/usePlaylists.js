import { useState, useEffect, useCallback } from 'react';
import {
  getPlaylistsMe,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistSongs,
  updatePlaylistSongs
} from '../services/playlistService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const handleAuthError = useCallback((err) => {
    if (err.message.includes('401')) {
      logout();
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else {
      toast.error(err.message || 'Đã có lỗi xảy ra.');
    }
    setError(err);
  }, [logout]);

  const fetchPlaylists = useCallback(async (signal) => {
    try {
      setLoading(true);
      const fetchedPlaylists = await getPlaylistsMe(signal);
      setPlaylists(Array.isArray(fetchedPlaylists) ? fetchedPlaylists : []);
    } catch (err) {
      if (err?.name !== "AbortError") {
        handleAuthError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [logout, handleAuthError]);

  useEffect(() => {
    const ac = new AbortController();
    fetchPlaylists(ac.signal);
    return () => ac.abort();
  }, [fetchPlaylists]);

  const addPlaylist = useCallback(async (playlistData) => {
    try {
      const newPlaylist = await createPlaylist(playlistData);
      setPlaylists((prev) => [...prev, newPlaylist]);
      toast.success('Tạo playlist thành công!');
      return newPlaylist;
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError]);

  const removePlaylist = useCallback(async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      toast.success('Xóa playlist thành công!');
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError]);

  const editPlaylist = useCallback(async (playlistId, playlistData) => {
    try {
      const updatedPlaylist = await updatePlaylist(playlistId, playlistData);
      setPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? updatedPlaylist : p))
      );
      toast.success('Cập nhật playlist thành công!');
      return updatedPlaylist;
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError]);

  const updatePlaylistSongsList = useCallback(async (playlistId, songUpdates) => {
    try {
      const updatedSongs = await updatePlaylistSongs(playlistId, songUpdates);
      // Optionally update the songCount in the local state if the API returns it
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, songCount: updatedSongs.length, songs: updatedSongs } : p
        )
      );
      toast.success('Cập nhật bài hát trong playlist thành công!');
      return updatedSongs;
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError]);

  const getSongsForPlaylist = useCallback(async (playlistId) => {
    try {
      return await getPlaylistSongs(playlistId);
    } catch (err) {
      handleAuthError(err);
      return []; // Return empty array on error
    }
  }, [handleAuthError]);

  return {
    playlists,
    loading,
    error,
    fetchPlaylists,
    addPlaylist,
    removePlaylist,
    editPlaylist,
    getSongsForPlaylist, // Use this instead of direct service call
    updatePlaylistSongsList,
  };
};

export default usePlaylists;
