// src/hooks/useSongsByTag.js
import { useState, useEffect } from 'react';
import { getSongsByTagName } from '../services/songService';

const useSongsByTag = (tagName) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tagName) {
      setSongs([]);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedSongs = await getSongsByTagName(tagName, 50, ac.signal); // Fetching up to 50 songs
        setSongs(fetchedSongs);
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error(`Error fetching songs for tag ${tagName}:`, e);
          setError(e);
        }
      } finally {
        if (!ac.signal.aborted) {
            setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => {
      ac.abort();
    };
  }, [tagName]);

  return { songs, loading, error };
};

export default useSongsByTag;
