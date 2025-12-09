import { useState, useEffect } from 'react';
import { getTagById } from '../services/tagService';

const useTag = (tagId) => {
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tagId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTag = async () => {
      try {
        setLoading(true);
        const fetchedTag = await getTagById(tagId, signal);
        setTag(fetchedTag);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTag();

    return () => {
      controller.abort();
    };
  }, [tagId]);

  return { tag, loading, error, setTag };
};

export default useTag;
