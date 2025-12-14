import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNotifications } from './useNotifications';
import {
  getAlbumsMe,
  getHomepageAlbums,     // ✅ NEW
  createAlbum,
  deleteAlbum,
  updateAlbum,
  getAlbumSongs,
  updateAlbumSongs
} from '../services/albumService';
import { useAuth } from '../context/AuthContext';

const useUserAlbums = ({
  scope = 'me',          // 'me' | 'public'
  homepageType = 'new',  // 'new' | 'top' | 'liked' | 'all'
  limit = 12,
} = {}) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  // ✅ chỉ logout khi scope=me
  const handleAuthError = useCallback((err) => {
    const msg = err?.message || 'Đã có lỗi xảy ra.';

    if (scope === 'me' && msg.includes('401')) {
      logout();
      notifyError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else {
      notifyError(msg);
    }
    setError(err);
  }, [logout, notifyError, scope]);

  const fetchAlbums = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      let fetchedAlbums = [];

      if (scope === 'public') {
        // ✅ HomePage: ai cũng xem được
        fetchedAlbums = await getHomepageAlbums({ type: homepageType, limit }, signal);
      } else {
        // ✅ My albums: cần đăng nhập
        fetchedAlbums = await getAlbumsMe(signal);
      }

      setAlbums(Array.isArray(fetchedAlbums) ? fetchedAlbums : []);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        // ✅ public vẫn hiển thị lỗi toast, nhưng không logout
        handleAuthError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [scope, homepageType, limit, handleAuthError]);

  useEffect(() => {
    const ac = new AbortController();
    fetchAlbums(ac.signal);
    return () => ac.abort();
  }, [fetchAlbums]);

  // ✅ các action create/update/delete chỉ hợp lý khi scope=me
  const addAlbum = useCallback(async (albumData) => {
    try {
      const newAlbum = await createAlbum(albumData);

      // cập nhật local cho nhanh
      setAlbums((prev) => [...prev, newAlbum]);

      notifySuccess('Tạo album thành công!');

      // ✅ Nếu bạn muốn HomePage tự thấy ngay, thì HomePage sẽ fetch public riêng
      // hoặc bạn có thể gọi fetchAlbums() tùy scope
      return newAlbum;
    } catch (err) {
      handleAuthError(err);
      return null;
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
      setAlbums((prev) => prev.map((a) => (a.id === albumId ? updatedAlbum : a)));
      notifySuccess('Cập nhật album thành công!');
      return updatedAlbum;
    } catch (err) {
      handleAuthError(err);
      return null;
    }
  }, [handleAuthError, notifySuccess]);

  const updateAlbumSongsList = useCallback(async (albumId, songUpdates) => {
    try {
      const updatedSongs = await updateAlbumSongs(albumId, songUpdates);
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === albumId
            ? { ...a, songCount: updatedSongs.length, songs: updatedSongs }
            : a
        )
      );
      notifySuccess('Cập nhật bài hát trong album thành công!');
      return updatedSongs;
    } catch (err) {
      handleAuthError(err);
      return null;
    }
  }, [handleAuthError, notifySuccess]);

  const getSongsForAlbum = useCallback(async (albumId) => {
    try {
      return await getAlbumSongs(albumId);
    } catch (err) {
      handleAuthError(err);
      return [];
    }
  }, [handleAuthError]);

  return useMemo(() => ({
    albums,
    loading,
    error,
    fetchAlbums,
    addAlbum,
    removeAlbum,
    editAlbum,
    getSongsForAlbum,
    updateAlbumSongsList,
  }), [albums, loading, error, fetchAlbums, addAlbum, removeAlbum, editAlbum, getSongsForAlbum, updateAlbumSongsList]);
};

export default useUserAlbums;
