import { useState, useEffect, useCallback } from 'react';
import { getAllPlaylists } from '../services/playlistService';

const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaylists = useCallback(async (signal) => {
    try {
      setLoading(true);
      const fetchedPlaylists = await getAllPlaylists(signal);
      setPlaylists(Array.isArray(fetchedPlaylists) ? fetchedPlaylists : []);
    } catch (err) {
      if (err?.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchPlaylists(ac.signal);
    return () => ac.abort();
  }, [fetchPlaylists]);

  const refetch = useCallback(() => {
    const ac = new AbortController();
    fetchPlaylists(ac.signal);
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch };
};

export default usePlaylists;