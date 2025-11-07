
import { useState, useEffect } from 'react';
import { search } from '../services/searchService';
import API_BASE_URL from '../config';

const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      try {
        setLoading(true);
        const searchResults = await search(query);

        const formattedResults = searchResults.songs.map(song => ({
          title: song.title,
          artists: song.artist,
          imageUrl: song.imageUrl,
          mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
        }));

        setResults(formattedResults);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    const debounceFetch = setTimeout(() => {
        fetchSearch();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  return { results, loading, error };
};

export default useSearch;
