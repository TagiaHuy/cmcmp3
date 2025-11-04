import { useState, useEffect } from 'react';
import { getAllSongs } from '../services/songService';
import song1 from '../assets/slaygirl.jpg'; // Placeholder image

const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const fetchedSongs = await getAllSongs();
        const formattedSongs = fetchedSongs.map(song => ({
          title: song.title,
          artists: song.artist,
          imageUrl: song1, // Placeholder image
          mediaSrc: `http://localhost:8080/api/songs/stream/${song.id}`,
        }));
        setSongs(formattedSongs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return { songs, loading, error };
};

export default useSongs;
