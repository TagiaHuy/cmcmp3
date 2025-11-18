import { useState, useEffect } from 'react';
import { getAllArtists } from '../services/artistService';

const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await getAllArtists();
        setArtists(response || []); // Assuming getAllArtists directly returns the array of artists
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return { artists, loading, error };
};

export default useArtists;
