import { useState, useEffect } from 'react';
import { search } from '../services/searchService';
import API_BASE_URL from '../config';

const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Khi query rỗng → reset kết quả
    if (!query || query.trim() === "") {
      setResults([]);
      return;
    }

    let isCancelled = false;

    const fetchSearch = async () => {
      try {
        setLoading(true);

        const searchResults = await search(query);

        if (!searchResults?.songs) return;

        const formattedResults = searchResults.songs.map(song => ({
          id: song.id,
          title: song.title,
          artists: song.artist,
          imageUrl: song.imageUrl,
          mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
        }));

        // Chỉ update nếu effect chưa bị cleanup
        if (!isCancelled) {
          setResults(formattedResults);
        }

      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    // ✅ Debounce 500ms
    const debounceTimer = setTimeout(fetchSearch, 100);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [query]);

  return { results, loading, error };
};

export default useSearch;
