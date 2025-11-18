// src/hooks/useSongs.js
import { useState, useEffect, useCallback } from 'react';
import { getAllSongs } from '../services/songService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const handleAuthError = useCallback((err) => {
    if (err.message.includes('401')) {
      logout();
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else {
      toast.error(err.message || 'Lỗi khi tải danh sách bài hát.');
    }
    setError(err);
  }, [logout]);

  const fetchSongs = useCallback(async () => {
    const ac = new AbortController();
    try {
      setLoading(true);
      const fetchedSongs = await getAllSongs(0, 1000, 'createdAt', 'desc', ac.signal);
      setSongs(Array.isArray(fetchedSongs) ? fetchedSongs : []);
    } catch (err) {
      if (err?.name !== "AbortError") {
        handleAuthError(err);
      }
    } finally {
      setLoading(false);
    }
    return () => ac.abort();
  }, [logout, handleAuthError]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return { songs, loading, error, refetch: fetchSongs };
};

export default useSongs;
