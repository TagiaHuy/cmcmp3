import { useState, useEffect } from 'react';
import { getSongById } from '../services/songService';
import API_BASE_URL from '../config';

const useSong = (songId) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!songId) {
      setLoading(false);
      return;
    }

    const fetchSong = async () => {
      try {
        setLoading(true);
        const fetchedSong = await getSongById(songId);
        if (fetchedSong) {
          const mediaSrc = `${API_BASE_URL}/api/songs/stream/${fetchedSong.id}`;
          setSong({ ...fetchedSong, mediaSrc });
        } else {
          setSong(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [songId]);

  return { song, loading, error };
};

export default useSong;
