import { useState, useEffect } from 'react';
import { getAllPlaylists } from '../services/playlistService';

const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const fetchedPlaylists = await getAllPlaylists();
        setPlaylists(fetchedPlaylists);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return { playlists, loading, error };
};

export default usePlaylists;
