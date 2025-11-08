import { useState, useEffect } from 'react';
import { getPlaylistById } from '../services/playlistService';

const usePlaylist = (playlistId) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playlistId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const fetchedPlaylist = await getPlaylistById(playlistId, signal);
        setPlaylist(fetchedPlaylist);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();

    return () => {
      controller.abort();
    };
  }, [playlistId]);

  return { playlist, loading, error };
};

export default usePlaylist;
