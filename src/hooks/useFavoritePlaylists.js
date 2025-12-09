import { useState, useEffect } from 'react';
import { getFavoritePlaylists } from '../services/playlistService';

const useFavoritePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    const fetchFavoritePlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        const favoritePlaylists = await getFavoritePlaylists(ac.signal);
        setPlaylists(favoritePlaylists || []);
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setError('Không thể tải danh sách playlist yêu thích.');
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePlaylists();

    return () => ac.abort();
  }, []);

  return { playlists, loading, error };
};

export default useFavoritePlaylists;