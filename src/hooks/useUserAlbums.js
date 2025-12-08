import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { getAlbumsMe } from '../services/albumService';
import { useAuth } from '../context/AuthContext';

const useUserAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const { notifyError } = useNotifications();

  const handleAuthError = useCallback((err) => {
    if (err.message.includes('401')) {
      logout();
      notifyError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else {
      notifyError(err.message || 'Đã có lỗi xảy ra.');
    }
    setError(err);
  }, [logout, notifyError]);

  const fetchUserAlbums = useCallback(async (signal) => {
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
  }, [handleAuthError]);

  useEffect(() => {
    const ac = new AbortController();
    fetchUserAlbums(ac.signal);
    return () => ac.abort();
  }, [fetchUserAlbums]);

  return {
    albums,
    loading,
    error,
    fetchUserAlbums,
  };
};

export default useUserAlbums;
