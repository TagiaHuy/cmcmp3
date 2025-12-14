import { useState, useEffect } from 'react';
import { getAlbumById } from '../services/albumService';

const useAlbum = (albumId) => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!albumId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const fetchedAlbum = await getAlbumById(albumId, signal);
        setAlbum(fetchedAlbum);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();

    return () => {
      controller.abort();
    };
  }, [albumId]);

  return { album, loading, error, setAlbum };
};

export default useAlbum;
