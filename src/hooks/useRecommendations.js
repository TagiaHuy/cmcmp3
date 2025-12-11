// src/hooks/useRecommendations.js
import { useState, useEffect, useCallback } from 'react';
import { getRecommendationsForMe } from '../services/recommendationService';

/**
 * Hook để lấy danh sách bài hát gợi ý cho người dùng.
 * - Tự động xử lý việc người dùng đã đăng nhập hay chưa.
 * - Nếu chưa đăng nhập hoặc không có lịch sử nghe, sẽ trả về top 10 bài hát thịnh hành.
 * @returns {{recs: Array<Object>, loading: boolean, error: Error|null, refetch: Function}}
 */
const useRecommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRecs = await getRecommendationsForMe(signal);
      setRecs(Array.isArray(fetchedRecs) ? fetchedRecs : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("useRecommendations - Lỗi khi lấy gợi ý:", err);
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchRecommendations(ac.signal);
    return () => ac.abort();
  }, [fetchRecommendations]);

  const refetch = useCallback(() => {
    const ac = new AbortController();
    fetchRecommendations(ac.signal);
    return () => ac.abort();
  }, [fetchRecommendations]);

  return { recs, loading, error, refetch };
};

export default useRecommendations;
