import { useState, useEffect } from 'react';
import commentService from '../services/commentService';

const useComments = (songId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        if (!songId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchComments = async () => {
            try {
                setLoading(true);
                const data = await commentService.getCommentsBySongId(songId, 0, 10, signal); // Pass page, size, and signal
                setComments(data.content);
                setPagination({
                    pageNumber: data.pageable.pageNumber,
                    pageSize: data.pageable.pageSize,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    last: data.last,
                    first: data.first,
                    numberOfElements: data.numberOfElements,
                    empty: data.empty,
                });
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchComments();

        return () => {
            controller.abort();
        };
    }, [songId]);

    return { comments, loading, error, pagination };
};

export default useComments;