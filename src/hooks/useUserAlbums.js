import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import {
  getAlbumsMe,
  createAlbum,
  deleteAlbum,
  updateAlbum,
  getAlbumSongs,
  updateAlbumSongs
} from '../services/albumService';
import { useAuth } from '../context/AuthContext';

const useUserAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  const handleAuthError = useCallback((err) => {
    if (err.message.includes('401')) {
      logout();
      notifyError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else {
      notifyError(err.message || 'Đã có lỗi xảy ra.');
    }
    setError(err);
  }, [logout, notifyError]);

  const fetchAlbums = useCallback(async (signal) => {
    try {
      setLoading(true);
      const fetchedAlbums = await getAlbumsMe(signal);
      setAlbums(Array.isArray(fetchedAlbums) ? fetchedAlbums : []);
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
    fetchAlbums(ac.signal);
    return () => ac.abort();
  }, [fetchAlbums]);

  const addAlbum = useCallback(async (albumData) => {
    try {
      const newAlbum = await createAlbum(albumData);
      setAlbums((prev) => [...prev, newAlbum]);
      notifySuccess('Tạo album thành công!');
      return newAlbum;
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError, notifySuccess]);

  const removeAlbum = useCallback(async (albumId) => {
    try {
      await deleteAlbum(albumId);
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      notifySuccess('Xóa album thành công!');
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError, notifySuccess]);

  const editAlbum = useCallback(async (albumId, albumData) => {
    try {
      const updatedAlbum = await updateAlbum(albumId, albumData);
      setAlbums((prev) =>
        prev.map((a) => (a.id === albumId ? updatedAlbum : a))
      );
      notifySuccess('Cập nhật album thành công!');
      return updatedAlbum;
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError, notifySuccess]);

  const updateAlbumSongsList = useCallback(async (albumId, songUpdates) => {
    try {
      const updatedSongs = await updateAlbumSongs(albumId, songUpdates);
      // Optionally update the songCount in the local state if the API returns it
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumId ? { ...a, songCount: updatedSongs.length, songs: updatedSongs } : a
        )
      );
      notifySuccess('Cập nhật bài hát trong album thành công!');
      return updatedSongs;
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError, notifySuccess]);

  const getSongsForAlbum = useCallback(async (albumId) => {
    try {
      return await getAlbumSongs(albumId);
    } catch (err) {
      handleAuthError(err);
      return []; // Return empty array on error
    }
  }, [handleAuthError]);

  return {
    albums,
    loading,
    error,
    fetchAlbums,
    addAlbum,
    removeAlbum,
    editAlbum,
    getSongsForAlbum,
    updateAlbumSongsList,
  };
};

export default useUserAlbums;