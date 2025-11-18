// src/hooks/useSong.js
import { useState, useEffect } from "react";
import { getSongById } from "../services/songService";

const useSong = (songId) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!songId) {
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    const fetchSong = async () => {
      try {
        setLoading(true);

        // 🎯 Bản song đã được normalize trong service
        const fetchedSong = await getSongById(songId, ac.signal);

        setSong(fetchedSong || null);
      } catch (err) {
        if (err?.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
    return () => ac.abort();
  }, [songId]);

  return { song, loading, error };
};

export default useSong;
