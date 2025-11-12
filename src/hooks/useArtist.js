
// src/hooks/useArtist.js
import { useState, useEffect } from 'react';
import { getArtistById } from '../services/artistService';

const useArtist = (artistId) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        const artistData = await getArtistById(artistId, signal);
        setArtist(artistData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();

    return () => {
      controller.abort();
    };
  }, [artistId]);

  return { artist, loading, error };
};

export default useArtist;
