import { useState, useEffect, useMemo } from 'react';
import { getSongById } from '../services/songService';
import API_BASE_URL from '../config';

const useSongsByIds = (songIds) => {
  const [songs, setSongs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Chuẩn hóa đầu vào + loại trùng (ổn định)
  const uniqueIds = useMemo(() => {
    return Array.isArray(songIds) ? Array.from(new Set(songIds)) : [];
  }, [songIds]);

  // Khóa ổn định để trigger effect
  const idsKey = useMemo(() => uniqueIds.join(','), [uniqueIds]);

  useEffect(() => {
    let cancelled = false;

    // Không có id → reset
    if (!idsKey) {
      setSongs([]);
      setLoading(false);
      setError(null);
      return () => { cancelled = true; };
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled(
          uniqueIds.map(id => getSongById(id))
        );

        const data = results
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value)
          .map(song => ({
            ...song,
            mediaSrc: `${API_BASE_URL}/api/songs/stream/${song.id}`,
          }));

        if (!cancelled) setSongs(data);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [idsKey]); // ✅ CHỈ idsKey, KHÔNG spread mảng vào đây

  return { songs, loading, error };
};

export default useSongsByIds;
