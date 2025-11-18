// src/hooks/useSongs.js
import { useState, useEffect } from 'react';
import { getAllSongs } from '../services/songService';

const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    const fetchSongs = async () => {
      try {
        setLoading(true);

        // 🎯 API đã trả đúng format (mapSong trong service)
        const fetchedSongs = await getAllSongs(0, 50, 'createdAt', 'desc', ac.signal);

        setSongs(Array.isArray(fetchedSongs) ? fetchedSongs : []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    return () => ac.abort();
  }, []);

  return { songs, loading, error };
};

export default useSongs;
