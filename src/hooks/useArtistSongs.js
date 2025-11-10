import { useState, useEffect } from 'react';
import { getSongsByArtist } from '../services/songService';

const useArtistSongs = (artistId) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const fetchedSongs = await getSongsByArtist(artistId, signal);
        setSongs(fetchedSongs);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    return () => {
      controller.abort();
    };
  }, [artistId]);

  return { songs, loading, error };
};

export default useArtistSongs;
