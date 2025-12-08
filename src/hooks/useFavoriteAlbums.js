import { useState, useEffect } from 'react';
import { getFavoriteAlbums } from '../services/albumService';

const useFavoriteAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    const fetchFavoriteAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const favoriteAlbums = await getFavoriteAlbums(ac.signal);
        setAlbums(favoriteAlbums || []);
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setError('Không thể tải danh sách album yêu thích.');
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteAlbums();

    return () => ac.abort();
  }, []);

  return { albums, loading, error };
};

export default useFavoriteAlbums;
