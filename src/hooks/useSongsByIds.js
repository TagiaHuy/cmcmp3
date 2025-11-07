import { useState, useEffect } from 'react';
import { getSongById } from '../services/songService';
import API_BASE_URL from '../config';

const useSongsByIds = (songIds) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!songIds || songIds.length === 0) {
      setLoading(false);
      setSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const songPromises = songIds.map(id => getSongById(id));
        const fetchedSongs = await Promise.all(songPromises);
        const formattedSongs = fetchedSongs.filter(Boolean).map(song => ({
          ...song,
          mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`
        }));
        setSongs(formattedSongs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [songIds]);

  return { songs, loading, error };
};

export default useSongsByIds;
